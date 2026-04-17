import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { query, withTransaction } from '../config/db.js';
import { AppError } from '../middleware/app-error.js';
import { slugify } from '../utils/slugify.js';
import { asBoolean, asString, repairTextEncoding } from '../utils/strings.js';

type BookStatus = 'published' | 'draft';
type PurchaseLinkType = 'physical' | 'ebook';

interface BookRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  year_published: string | null;
  cover_image_url: string | null;
  category: string | null;
  synopsis: string | null;
  isbn: string | null;
  show_review_section: number;
  show_technical_details: number;
  show_purchase_links: number;
  publisher: string | null;
  page_count: string | null;
  technical_year: string | null;
  format: string | null;
  technical_details_extra: string | null;
  is_featured: number;
  status: BookStatus;
  created_at: string;
  updated_at: string;
}

interface BookLinkRow extends RowDataPacket {
  id: number;
  book_id: number;
  link_type: PurchaseLinkType;
  url: string;
}

interface BookQuoteRow extends RowDataPacket {
  id: number;
  book_id: number;
  quote_text: string;
  quote_source: string | null;
  sort_order: number;
  is_active: number;
}

export interface BookQuote {
  id?: number;
  quoteText: string;
  quoteSource: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  coverImage: string;
  category: string;
  synopsis: string;
  isbn: string;
  physicalPurchaseLink: string;
  ebookPurchaseLink: string;
  showReviewSection: boolean;
  showTechnicalDetails: boolean;
  showPurchaseLinks: boolean;
  reviewText: string;
  reviewSource: string;
  quotes: BookQuote[];
  publisher: string;
  pageCount: string;
  technicalYear: string;
  format: string;
  technicalDetailsExtra: string;
  isFeatured: boolean;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

interface BookInput {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  coverImage: string;
  category: string;
  synopsis: string;
  isbn: string;
  showReviewSection: boolean;
  showTechnicalDetails: boolean;
  showPurchaseLinks: boolean;
  publisher: string;
  pageCount: string;
  technicalYear: string;
  format: string;
  technicalDetailsExtra: string;
  isFeatured: boolean;
  status: BookStatus;
  purchaseLinks: Array<{ linkType: PurchaseLinkType; url: string }>;
  quotes: BookQuote[];
}

const defaultCover = '/livro1.png';

const seededBookCopy: Record<string, Partial<Pick<Book, 'title' | 'subtitle' | 'category' | 'synopsis'>>> = {
  'a-historia-da-biblia': {
    title: 'A História da Bíblia',
    subtitle: 'Da Tradição Oral ao Cânon Sagrado',
    category: 'Religião',
    synopsis: 'Uma análise profunda sobre a formação dos textos sagrados.',
  },
  'aparicoes-da-virgem-maria': {
    title: 'Aparições da Virgem Maria',
    subtitle: 'De Guadalupe a Medjugorje',
    category: 'Religião',
    synopsis: 'Estudo histórico e fenomenológico das mariologias contemporâneas.',
  },
  'historia-das-religioes': {
    title: 'História das Religiões',
    subtitle: 'Judaísmo, Hinduísmo, Budismo, Cristianismo e Islamismo',
    category: 'Religião',
    synopsis: 'Um panorama das grandes tradições espirituais da humanidade.',
  },
};

const normalizeBookInput = (payload: unknown): BookInput => {
  const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
  const title = asString(data.title);

  if (!title) {
    throw new AppError('O título do livro é obrigatório.', 422);
  }

  const reviewText = asString(data.reviewText);
  const reviewSource = asString(data.reviewSource);
  const rawQuotes = Array.isArray(data.quotes) ? data.quotes : [];
  const fallbackQuotes =
    reviewText || reviewSource
      ? [
          {
            quoteText: reviewText,
            quoteSource: reviewSource,
            sortOrder: 0,
            isActive: true,
          },
        ]
      : [];

  const quotes = (rawQuotes.length > 0 ? rawQuotes : fallbackQuotes)
    .map((quote, index) => {
      const item = (quote && typeof quote === 'object' ? quote : {}) as Record<string, unknown>;
      return {
        id: typeof item.id === 'number' ? item.id : undefined,
        quoteText: asString(item.quoteText),
        quoteSource: asString(item.quoteSource),
        sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index,
        isActive: item.isActive === undefined ? true : asBoolean(item.isActive),
      };
    })
    .filter((quote) => quote.quoteText);

  const physicalPurchaseLink = asString(data.physicalPurchaseLink);
  const ebookPurchaseLink = asString(data.ebookPurchaseLink);
  const rawPurchaseLinks = Array.isArray(data.purchaseLinks) ? data.purchaseLinks : [];
  const purchaseLinks = [
    ...rawPurchaseLinks
      .map((link) => {
        const item = (link && typeof link === 'object' ? link : {}) as Record<string, unknown>;
        const linkType = item.linkType === 'ebook' ? 'ebook' : item.linkType === 'physical' ? 'physical' : null;
        const url = asString(item.url);
        return linkType && url ? { linkType, url } : null;
      })
      .filter((link): link is { linkType: PurchaseLinkType; url: string } => Boolean(link)),
    ...(physicalPurchaseLink ? [{ linkType: 'physical' as const, url: physicalPurchaseLink }] : []),
    ...(ebookPurchaseLink ? [{ linkType: 'ebook' as const, url: ebookPurchaseLink }] : []),
  ].filter((link, index, allLinks) => allLinks.findIndex((item) => item.linkType === link.linkType) === index);

  return {
    slug: slugify(asString(data.slug) || title),
    title,
    subtitle: asString(data.subtitle),
    year: asString(data.year),
    coverImage: asString(data.coverImage) || defaultCover,
    category: asString(data.category) || 'Religião',
    synopsis: asString(data.synopsis),
    isbn: asString(data.isbn),
    showReviewSection: asBoolean(data.showReviewSection),
    showTechnicalDetails: asBoolean(data.showTechnicalDetails),
    showPurchaseLinks: data.showPurchaseLinks === undefined ? purchaseLinks.length > 0 : asBoolean(data.showPurchaseLinks),
    publisher: asString(data.publisher),
    pageCount: asString(data.pageCount),
    technicalYear: asString(data.technicalYear),
    format: asString(data.format),
    technicalDetailsExtra: asString(data.technicalDetailsExtra),
    isFeatured: asBoolean(data.isFeatured),
    status: data.status === 'published' ? 'published' : 'draft',
    purchaseLinks,
    quotes,
  };
};

const ensureUniqueBookSlug = async (slug: string, currentId?: number) => {
  let candidate = slug || `livro-${Date.now()}`;
  let suffix = 1;

  while (true) {
    const rows = await query<RowDataPacket[]>(
      'SELECT id FROM books WHERE slug = ? AND (? IS NULL OR id <> ?) LIMIT 1',
      [candidate, currentId ?? null, currentId ?? null],
    );

    if (rows.length === 0) {
      return candidate;
    }

    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
};

const mapBooks = (rows: BookRow[], links: BookLinkRow[], quotes: BookQuoteRow[]): Book[] =>
  rows.map((row) => {
    const seededCopy = seededBookCopy[row.slug];
    const relatedLinks = links.filter((link) => link.book_id === row.id);
    const relatedQuotes = quotes
      .filter((quote) => quote.book_id === row.id)
      .sort((first, second) => first.sort_order - second.sort_order)
      .map((quote) => ({
        id: quote.id,
        quoteText: quote.quote_text,
        quoteSource: quote.quote_source || '',
        sortOrder: quote.sort_order,
        isActive: asBoolean(quote.is_active),
      }));

    const primaryQuote = relatedQuotes.find((quote) => quote.isActive) || relatedQuotes[0];
    const physicalPurchaseLink = relatedLinks.find((link) => link.link_type === 'physical')?.url || '';
    const ebookPurchaseLink = relatedLinks.find((link) => link.link_type === 'ebook')?.url || '';

    return {
      id: row.id,
      slug: row.slug,
      title: seededCopy?.title || repairTextEncoding(row.title),
      subtitle: seededCopy?.subtitle || repairTextEncoding(row.subtitle || ''),
      year: row.year_published || '',
      coverImage: row.cover_image_url || defaultCover,
      category: seededCopy?.category || repairTextEncoding(row.category || ''),
      synopsis: seededCopy?.synopsis || repairTextEncoding(row.synopsis || ''),
      isbn: row.isbn || '',
      physicalPurchaseLink,
      ebookPurchaseLink,
      showReviewSection: asBoolean(row.show_review_section),
      showTechnicalDetails: asBoolean(row.show_technical_details),
      showPurchaseLinks: asBoolean(row.show_purchase_links),
      reviewText: primaryQuote?.quoteText || '',
      reviewSource: primaryQuote?.quoteSource || '',
      quotes: relatedQuotes,
      publisher: row.publisher || '',
      pageCount: row.page_count || '',
      technicalYear: row.technical_year || '',
      format: row.format || '',
      technicalDetailsExtra: row.technical_details_extra || '',
      isFeatured: asBoolean(row.is_featured),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

const queryRows = async <T extends RowDataPacket[]>(
  sql: string,
  params: unknown[] = [],
  connection?: PoolConnection,
) => {
  if (connection) {
    const [rows] = await connection.execute<T>(sql, params as never[]);
    return rows;
  }

  return query<T>(sql, params);
};

const fetchBooksWithRelations = async (
  whereClause = '',
  params: unknown[] = [],
  connection?: PoolConnection,
) => {
  const rows = await queryRows<BookRow[]>(
    `
      SELECT *
      FROM books
      ${whereClause}
      ORDER BY is_featured DESC, updated_at DESC, id DESC
    `,
    params,
    connection,
  );

  if (rows.length === 0) {
    return [];
  }

  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => '?').join(',');
  const links = await queryRows<BookLinkRow[]>(
    `SELECT * FROM book_purchase_links WHERE book_id IN (${placeholders}) ORDER BY id ASC`,
    ids,
    connection,
  );
  const quotes = await queryRows<BookQuoteRow[]>(
    `SELECT * FROM book_quotes WHERE book_id IN (${placeholders}) ORDER BY sort_order ASC, id ASC`,
    ids,
    connection,
  );

  return mapBooks(rows, links, quotes);
};

const replaceBookRelations = async (connection: PoolConnection, bookId: number, input: BookInput) => {
  await connection.execute('DELETE FROM book_purchase_links WHERE book_id = ?', [bookId]);
  await connection.execute('DELETE FROM book_quotes WHERE book_id = ?', [bookId]);

  for (const link of input.purchaseLinks) {
    await connection.execute('INSERT INTO book_purchase_links (book_id, link_type, url) VALUES (?, ?, ?)', [
      bookId,
      link.linkType,
      link.url,
    ]);
  }

  for (const quote of input.quotes) {
    await connection.execute(
      'INSERT INTO book_quotes (book_id, quote_text, quote_source, sort_order, is_active) VALUES (?, ?, ?, ?, ?)',
      [bookId, quote.quoteText, quote.quoteSource || null, quote.sortOrder, quote.isActive ? 1 : 0],
    );
  }
};

export const listBooks = async (status?: BookStatus) => {
  if (!status) {
    return fetchBooksWithRelations();
  }

  return fetchBooksWithRelations('WHERE status = ?', [status]);
};

export const getBookById = async (bookId: number) => {
  const books = await fetchBooksWithRelations('WHERE id = ?', [bookId]);
  return books[0] || null;
};

export const getBookBySlug = async (slug: string) => {
  const books = await fetchBooksWithRelations('WHERE slug = ?', [slug]);
  return books[0] || null;
};

export const createBook = async (payload: unknown) => {
  const input = normalizeBookInput(payload);
  input.slug = await ensureUniqueBookSlug(input.slug);

  return withTransaction(async (connection) => {
    const [result] = await connection.execute(
      `
        INSERT INTO books (
          slug,
          title,
          subtitle,
          year_published,
          cover_image_url,
          category,
          synopsis,
          isbn,
          show_review_section,
          show_technical_details,
          show_purchase_links,
          publisher,
          page_count,
          technical_year,
          format,
          technical_details_extra,
          is_featured,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        input.slug,
        input.title,
        input.subtitle || null,
        input.year || null,
        input.coverImage || null,
        input.category || null,
        input.synopsis || null,
        input.isbn || null,
        input.showReviewSection ? 1 : 0,
        input.showTechnicalDetails ? 1 : 0,
        input.showPurchaseLinks ? 1 : 0,
        input.publisher || null,
        input.pageCount || null,
        input.technicalYear || null,
        input.format || null,
        input.technicalDetailsExtra || null,
        input.isFeatured ? 1 : 0,
        input.status,
      ],
    );

    const bookId = Number((result as { insertId: number }).insertId);
    await replaceBookRelations(connection, bookId, input);

    const [book] = await fetchBooksWithRelations('WHERE id = ?', [bookId], connection);

    if (!book) {
      throw new AppError('Não foi possível carregar o livro após o cadastro.', 500);
    }

    return book;
  });
};

export const updateBook = async (bookId: number, payload: unknown) => {
  const existingBook = await getBookById(bookId);

  if (!existingBook) {
    throw new AppError('Livro não encontrado.', 404);
  }

  const input = normalizeBookInput(payload);
  input.slug = await ensureUniqueBookSlug(input.slug, bookId);

  return withTransaction(async (connection) => {
    await connection.execute(
      `
        UPDATE books
        SET
          slug = ?,
          title = ?,
          subtitle = ?,
          year_published = ?,
          cover_image_url = ?,
          category = ?,
          synopsis = ?,
          isbn = ?,
          show_review_section = ?,
          show_technical_details = ?,
          show_purchase_links = ?,
          publisher = ?,
          page_count = ?,
          technical_year = ?,
          format = ?,
          technical_details_extra = ?,
          is_featured = ?,
          status = ?
        WHERE id = ?
      `,
      [
        input.slug,
        input.title,
        input.subtitle || null,
        input.year || null,
        input.coverImage || null,
        input.category || null,
        input.synopsis || null,
        input.isbn || null,
        input.showReviewSection ? 1 : 0,
        input.showTechnicalDetails ? 1 : 0,
        input.showPurchaseLinks ? 1 : 0,
        input.publisher || null,
        input.pageCount || null,
        input.technicalYear || null,
        input.format || null,
        input.technicalDetailsExtra || null,
        input.isFeatured ? 1 : 0,
        input.status,
        bookId,
      ],
    );

    await replaceBookRelations(connection, bookId, input);

    const [book] = await fetchBooksWithRelations('WHERE id = ?', [bookId], connection);

    if (!book) {
      throw new AppError('Não foi possível carregar o livro após a atualização.', 500);
    }

    return book;
  });
};

export const deleteBook = async (bookId: number) => {
  const book = await getBookById(bookId);

  if (!book) {
    throw new AppError('Livro não encontrado.', 404);
  }

  await withTransaction(async (connection) => {
    await connection.execute('DELETE FROM book_purchase_links WHERE book_id = ?', [bookId]);
    await connection.execute('DELETE FROM book_quotes WHERE book_id = ?', [bookId]);
    await connection.execute('DELETE FROM books WHERE id = ?', [bookId]);
  });
};
