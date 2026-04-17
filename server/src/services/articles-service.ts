import type { RowDataPacket } from 'mysql2/promise';
import { execute, query } from '../config/db.js';
import { AppError } from '../middleware/app-error.js';
import { slugify } from '../utils/slugify.js';
import { asString, repairTextEncoding } from '../utils/strings.js';

type ArticleStatus = 'published' | 'draft';

interface ArticleRow extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  author_name: string | null;
  published_at: string | null;
  display_date: string | null;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  tags_json: unknown;
  meta_title: string | null;
  meta_description: string | null;
  image_url: string | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  authorName: string;
  publishedAt: string;
  displayDate: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt: string;
}

interface ArticleInput {
  slug: string;
  title: string;
  authorName: string;
  publishedAt: string;
  displayDate: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
  status: ArticleStatus;
}

const seededArticleCopy: Record<string, Partial<Pick<Article, 'title' | 'displayDate' | 'excerpt' | 'content' | 'category'>>> = {
  'notas-sobre-a-historiografia-na-literatura-de-cordel': {
    title: 'Notas sobre a historiografia na literatura de cordel',
    displayDate: '12 Março, 2026',
    excerpt: 'Uma breve análise sobre como a memória popular nordestina preservou fatos que a academia muitas vezes relegou às notas de rodapé.',
    content: 'Conteúdo completo do artigo aqui...',
    category: 'História',
  },
  'o-processo-criativo-por-tras-de-a-historia-da-biblia': {
    title: 'O processo criativo por trás de A História da Bíblia',
    displayDate: '05 Fevereiro, 2026',
    excerpt: 'Neste ensaio pessoal, discuto as motivações e os obstáculos de se escrever sobre tradição e cânon em um século de ruídos constantes.',
    content: 'Conteúdo completo do artigo aqui...',
    category: 'Bastidores',
  },
};

const parseTags = (value: unknown) => {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
};

const normalizePublishedAt = (value: unknown) => {
  if (!value) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const rawValue = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(rawValue)) {
    return rawValue.slice(0, 10);
  }

  const parsedDate = new Date(rawValue);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().slice(0, 10);
  }

  return rawValue.slice(0, 10);
};

const mapArticle = (row: ArticleRow): Article => ({
  ...(seededArticleCopy[row.slug] || {}),
  id: row.id,
  slug: row.slug,
  title: seededArticleCopy[row.slug]?.title || repairTextEncoding(row.title),
  authorName: repairTextEncoding(row.author_name || ''),
  publishedAt: normalizePublishedAt(row.published_at),
  displayDate: seededArticleCopy[row.slug]?.displayDate || repairTextEncoding(row.display_date || ''),
  excerpt: seededArticleCopy[row.slug]?.excerpt || repairTextEncoding(row.excerpt || ''),
  content: seededArticleCopy[row.slug]?.content || repairTextEncoding(row.content || ''),
  category: seededArticleCopy[row.slug]?.category || repairTextEncoding(row.category || ''),
  tags: parseTags(row.tags_json).map((tag) => repairTextEncoding(tag)),
  metaTitle: repairTextEncoding(row.meta_title || ''),
  metaDescription: repairTextEncoding(row.meta_description || ''),
  imageUrl: row.image_url || '',
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const normalizeArticleInput = (payload: unknown): ArticleInput => {
  const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
  const title = asString(data.title);

  if (!title) {
    throw new AppError('O título do artigo é obrigatório.', 422);
  }

  return {
    slug: slugify(asString(data.slug) || title),
    title,
    authorName: asString(data.authorName),
    publishedAt: normalizePublishedAt(asString(data.publishedAt)),
    displayDate: asString(data.displayDate),
    excerpt: asString(data.excerpt),
    content: asString(data.content),
    category: asString(data.category) || 'Artigos',
    tags: Array.isArray(data.tags)
      ? data.tags.map((item) => asString(item)).filter(Boolean)
      : asString(data.tags)
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
    metaTitle: asString(data.metaTitle),
    metaDescription: asString(data.metaDescription),
    imageUrl: asString(data.imageUrl),
    status: data.status === 'published' ? 'published' : 'draft',
  };
};

const ensureUniqueArticleSlug = async (slug: string, currentId?: number) => {
  let candidate = slug || `artigo-${Date.now()}`;
  let suffix = 1;

  while (true) {
    const rows = await query<RowDataPacket[]>(
      'SELECT id FROM articles WHERE slug = ? AND (? IS NULL OR id <> ?) LIMIT 1',
      [candidate, currentId ?? null, currentId ?? null],
    );

    if (rows.length === 0) {
      return candidate;
    }

    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
};

export const listArticles = async (status?: ArticleStatus) => {
  const rows = await query<ArticleRow[]>(
    `
      SELECT *
      FROM articles
      ${status ? 'WHERE status = ?' : ''}
      ORDER BY COALESCE(published_at, updated_at) DESC, id DESC
    `,
    status ? [status] : [],
  );

  return rows.map(mapArticle);
};

export const getArticleById = async (articleId: number) => {
  const rows = await query<ArticleRow[]>('SELECT * FROM articles WHERE id = ? LIMIT 1', [articleId]);
  return rows[0] ? mapArticle(rows[0]) : null;
};

export const getArticleBySlug = async (slug: string) => {
  const rows = await query<ArticleRow[]>('SELECT * FROM articles WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] ? mapArticle(rows[0]) : null;
};

export const createArticle = async (payload: unknown) => {
  const input = normalizeArticleInput(payload);
  input.slug = await ensureUniqueArticleSlug(input.slug);

  const result = await execute(
    `
      INSERT INTO articles (
        slug,
        title,
        author_name,
        published_at,
        display_date,
        excerpt,
        content,
        category,
        tags_json,
        meta_title,
        meta_description,
        image_url,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      input.slug,
      input.title,
      input.authorName || null,
      input.publishedAt || null,
      input.displayDate || null,
      input.excerpt || null,
      input.content || null,
      input.category || null,
      JSON.stringify(input.tags),
      input.metaTitle || null,
      input.metaDescription || null,
      input.imageUrl || null,
      input.status,
    ],
  );

  const article = await getArticleById(result.insertId);

  if (!article) {
    throw new AppError('Não foi possível carregar o artigo após o cadastro.', 500);
  }

  return article;
};

export const updateArticle = async (articleId: number, payload: unknown) => {
  const existingArticle = await getArticleById(articleId);

  if (!existingArticle) {
    throw new AppError('Artigo não encontrado.', 404);
  }

  const input = normalizeArticleInput(payload);
  input.slug = await ensureUniqueArticleSlug(input.slug, articleId);

  await execute(
    `
      UPDATE articles
      SET
        slug = ?,
        title = ?,
        author_name = ?,
        published_at = ?,
        display_date = ?,
        excerpt = ?,
        content = ?,
        category = ?,
        tags_json = ?,
        meta_title = ?,
        meta_description = ?,
        image_url = ?,
        status = ?
      WHERE id = ?
    `,
    [
      input.slug,
      input.title,
      input.authorName || null,
      input.publishedAt || null,
      input.displayDate || null,
      input.excerpt || null,
      input.content || null,
      input.category || null,
      JSON.stringify(input.tags),
      input.metaTitle || null,
      input.metaDescription || null,
      input.imageUrl || null,
      input.status,
      articleId,
    ],
  );

  const article = await getArticleById(articleId);

  if (!article) {
    throw new AppError('Não foi possível carregar o artigo após a atualização.', 500);
  }

  return article;
};

export const deleteArticle = async (articleId: number) => {
  const existingArticle = await getArticleById(articleId);

  if (!existingArticle) {
    throw new AppError('Artigo não encontrado.', 404);
  }

  await execute('DELETE FROM articles WHERE id = ?', [articleId]);
};
