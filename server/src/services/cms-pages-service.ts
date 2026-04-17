import type { RowDataPacket } from 'mysql2/promise';
import { execute, query } from '../config/db.js';
import { AppError } from '../middleware/app-error.js';
import { asBoolean, asString, repairTextEncoding } from '../utils/strings.js';

export type CmsPageSlug = 'home' | 'about' | 'contact' | 'site';
export type CmsPageStatus = 'published' | 'draft';
export type CmsPageBlockType =
  | 'hero'
  | 'richText'
  | 'bookHighlights'
  | 'featureList'
  | 'contactDetails'
  | 'contactForm'
  | 'cta'
  | 'navigation'
  | 'siteSettings';

export interface CmsPageBlock {
  id?: number;
  key: string;
  label: string;
  type: CmsPageBlockType;
  sortOrder: number;
  isActive: boolean;
  data: Record<string, unknown>;
}

export interface CmsPage {
  id: number;
  slug: CmsPageSlug;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  status: CmsPageStatus;
  blocks: CmsPageBlock[];
  createdAt: string;
  updatedAt: string;
}

interface CmsPageRow extends RowDataPacket {
  id: number;
  slug: CmsPageSlug;
  title: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: CmsPageStatus;
  content_json: unknown;
  created_at: string;
  updated_at: string;
}

const allowedPageSlugs = ['home', 'about', 'contact', 'site'] as const;
const allowedBlockTypes = new Set<CmsPageBlockType>([
  'hero',
  'richText',
  'bookHighlights',
  'featureList',
  'contactDetails',
  'contactForm',
  'cta',
  'navigation',
  'siteSettings',
]);

const timestamp = '2026-03-12T00:00:00.000Z';

const sanitizeContentNode = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return repairTextEncoding(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeContentNode(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, itemValue]) => [key, sanitizeContentNode(itemValue)]),
    );
  }

  return value;
};

const formatTimestamp = (value: unknown) => {
  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return timestamp;
};

const defaultCmsPages: CmsPage[] = [
  {
    id: 1,
    slug: 'home',
    title: 'Home',
    description: 'Pagina inicial do site institucional.',
    seoTitle: 'Nilton Amaral | Escritor e Pesquisador',
    seoDescription: 'Site oficial de Nilton Amaral, escritor, pesquisador e ensaista brasileiro.',
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
    blocks: [
      {
        key: 'hero',
        label: 'Hero',
        type: 'hero',
        sortOrder: 0,
        isActive: true,
        data: {
          title: 'A palavra como instrumento de exploracao do ser.',
          subtitle:
            'Ensaios academicos, romances historicos e analises literarias que buscam compreender a complexidade da experiencia humana atraves das eras.',
          primaryCtaLabel: 'Conhecer Obras',
          primaryCtaHref: '/livros',
          secondaryCtaLabel: 'Sobre o Autor',
          secondaryCtaHref: '/sobre',
          authorImageUrl: '/autor.jpg',
          authorImageAlt: 'Retrato do autor Nilton Celio da Silva Amaral',
          backgroundBook1Url: '/livro1.png',
          backgroundBook2Url: '/livro2.png',
          backgroundBook3Url: '/livro3.png',
        },
      },
      {
        key: 'featuredBooks',
        label: 'Livros em destaque',
        type: 'bookHighlights',
        sortOrder: 1,
        isActive: true,
        data: {
          title: 'Obras em Destaque',
          description: 'Uma selecao dos trabalhos mais recentes e premiados.',
          ctaLabel: 'Ver todo o catalogo',
          ctaHref: '/livros',
        },
      },
      {
        key: 'authorIntro',
        label: 'Introducao do autor',
        type: 'richText',
        sortOrder: 2,
        isActive: true,
        data: {
          title: 'Sobre Nilton Amaral',
          body:
            'Com mais de duas decadas dedicadas a pesquisa historica e a literatura, Nilton Celio da Silva Amaral estabeleceu-se como uma voz fundamental na interseccao entre o rigor academico e a narrativa envolvente.',
          secondaryBody:
            'Sua obra transita entre o ensaio filosofico e o romance, sempre ancorada em extensa pesquisa documental e em uma leitura critica da experiencia humana no contexto brasileiro.',
          ctaLabel: 'Ler Biografia Completa',
          ctaHref: '/sobre',
        },
      },
      {
        key: 'researchThemes',
        label: 'Temas de pesquisa',
        type: 'featureList',
        sortOrder: 3,
        isActive: true,
        data: {
          title: 'Temas de Pesquisa',
          items: [
            'Historia Colonial Brasileira',
            'Sociologia da Literatura',
            'Memoria e Identidade Nacional',
            'Filosofia do Tempo',
          ],
        },
      },
      {
        key: 'contactCta',
        label: 'CTA institucional',
        type: 'cta',
        sortOrder: 4,
        isActive: true,
        data: {
          title: 'Entrevistas, Palestras e Consultoria',
          description:
            'O autor esta disponivel para participacao em eventos academicos, feiras literarias e bancas de avaliacao. Para solicitacoes da imprensa ou convites, entre em contato.',
          ctaLabel: 'Entrar em Contato',
          ctaHref: '/contato',
        },
      },
    ],
  },
  {
    id: 2,
    slug: 'about',
    title: 'Sobre',
    description: 'Pagina institucional do autor.',
    seoTitle: 'Sobre o Autor | Nilton Amaral',
    seoDescription: 'Biografia, formacao academica e trajetoria literaria de Nilton Amaral.',
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
    blocks: [
      {
        key: 'hero',
        label: 'Hero',
        type: 'hero',
        sortOrder: 0,
        isActive: true,
        data: {
          title: 'Sobre o Autor',
          subtitle: 'Uma vida dedicada a interseccao entre a historia, a filosofia e a literatura.',
        },
      },
      {
        key: 'biography',
        label: 'Biografia',
        type: 'richText',
        sortOrder: 1,
        isActive: true,
        data: {
          title: 'Trajetoria',
          portraitUrl: '/autor.jpg',
          portraitAlt: 'Nilton Amaral em seu escritorio',
          trajetoria:
            'Nascido em Sao Paulo em 1968, Nilton Celio da Silva Amaral desenvolveu desde cedo um fascinio particular pelas narrativas historicas.',
          transitionTitle: 'A Transicao para a Literatura',
          transicao:
            "A publicacao de sua obra conceitual, 'A Historia da Biblia' (2026), marcou uma inflexao em sua carreira e consolidou sua presenca editorial.",
          closingParagraph:
            'Desde entao, o autor alterna entre a publicacao de ficcao e ensaios, sendo reconhecido por um estilo de prosa analitica e elegiaca.',
        },
      },
      {
        key: 'academicBackground',
        label: 'Formacao academica',
        type: 'featureList',
        sortOrder: 2,
        isActive: true,
        data: {
          title: 'Formacao Academica',
          items: [
            'Doutorado em Historia Social (USP, 1998)',
            'Mestrado em Sociologia da Cultura (Unicamp, 1994)',
            'Bacharelado em Historia (USP, 1990)',
          ],
        },
      },
      {
        key: 'selectedAwards',
        label: 'Premios',
        type: 'featureList',
        sortOrder: 3,
        isActive: true,
        data: {
          title: 'Premios Selecionados',
          items: [
            'Premio Literario Nacional (Melhor Ensaio, 2023)',
            'Mencao Honrosa da Academia Brasileira de Letras (2022)',
            'Premio Revelacao em Ficcao Historica (2021)',
          ],
        },
      },
    ],
  },
  {
    id: 3,
    slug: 'contact',
    title: 'Contato',
    description: 'Pagina de contato institucional.',
    seoTitle: 'Contato | Nilton Amaral',
    seoDescription: 'Entre em contato para palestras, entrevistas ou mensagens de leitores.',
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
    blocks: [
      {
        key: 'hero',
        label: 'Hero',
        type: 'hero',
        sortOrder: 0,
        isActive: true,
        data: {
          title: 'Contato Institucional',
          subtitle: 'Para convites academicos, solicitacoes da imprensa e correspondencia com leitores.',
        },
      },
      {
        key: 'intro',
        label: 'Introducao',
        type: 'richText',
        sortOrder: 1,
        isActive: true,
        data: {
          title: 'Vamos conversar',
          body:
            'A literatura nao se encerra na ultima pagina; ela continua no dialogo com o leitor. Sinta-se livre para enviar suas impressoes.',
          secondaryBody:
            'Para assuntos profissionais, editoriais e agendamentos de palestras, utilize preferencialmente o e-mail ou o formulario ao lado.',
        },
      },
      {
        key: 'contactDetails',
        label: 'Dados de contato',
        type: 'contactDetails',
        sortOrder: 2,
        isActive: true,
        data: {
          emailTitle: 'E-mail Direto',
          email: 'contato@niltonamaral.com.br',
          phoneTitle: 'Assessoria de Imprensa',
          phone: '+55 (11) 98765-4321',
          addressTitle: 'Correspondencia Fisica',
          address: 'Sao Paulo, SP - Brasil',
          postalCode: 'CEP 01000-000',
        },
      },
      {
        key: 'contactForm',
        label: 'Formulario',
        type: 'contactForm',
        sortOrder: 3,
        isActive: true,
        data: {
          title: 'Envie uma mensagem',
          submitLabel: 'Enviar Mensagem',
          subjectOptions: [
            'Mensagem de Leitor',
            'Solicitacao de Imprensa',
            'Convite Academico',
            'Direitos Autorais',
            'Outro',
          ],
        },
      },
    ],
  },
  {
    id: 4,
    slug: 'site',
    title: 'Rodape do Site',
    description: 'Conteudos globais do rodape publico.',
    seoTitle: 'Rodape do Site | Nilton Amaral',
    seoDescription: 'Conteudos globais usados no rodape publico do site.',
    status: 'published',
    createdAt: timestamp,
    updatedAt: timestamp,
    blocks: [
      {
        key: 'footerBrand',
        label: 'Bloco institucional',
        type: 'siteSettings',
        sortOrder: 0,
        isActive: true,
        data: {
          siteTitle: 'Nilton Amaral',
          description:
            'Escritor, pesquisador e autor independente. Explorando as profundezas da condicao humana atraves da literatura academica e ficcional.',
        },
      },
      {
        key: 'footerNavigation',
        label: 'Links rapidos',
        type: 'navigation',
        sortOrder: 1,
        isActive: true,
        data: {
          title: 'Links Rapidos',
          link1Label: 'Sobre o Autor',
          link1Href: '/sobre',
          link2Label: 'Livros',
          link2Href: '/livros',
          link3Label: 'Blog',
          link3Href: '/blog',
          link4Label: 'Contato',
          link4Href: '/contato',
        },
      },
      {
        key: 'footerContact',
        label: 'Contato',
        type: 'contactDetails',
        sortOrder: 2,
        isActive: true,
        data: {
          title: 'Contato',
          email: 'contato@niltonamaral.com.br',
          location: 'Sao Paulo, SP - Brasil',
        },
      },
      {
        key: 'footerLegal',
        label: 'Faixa legal',
        type: 'siteSettings',
        sortOrder: 3,
        isActive: true,
        data: {
          copyrightText: 'Copyright 2026 Nilton Celio da Silva Amaral. Todos os direitos reservados.',
          privacyLabel: 'Politica de Privacidade',
          privacyHref: '/privacidade',
        },
      },
    ],
  },
];

const defaultPagesBySlug = new Map(defaultCmsPages.map((page) => [page.slug, page]));

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const isCmsPageSlug = (value: string): value is CmsPageSlug =>
  allowedPageSlugs.includes(value as CmsPageSlug);

const safeParseContent = (value: unknown) => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
};

const normalizeBlockData = (value: unknown) => {
  if (!isPlainObject(value)) {
    return {};
  }

  return sanitizeContentNode(value) as Record<string, unknown>;
};

const normalizeBlocks = (value: unknown, fallbackBlocks: CmsPageBlock[]) => {
  if (!Array.isArray(value)) {
    return fallbackBlocks;
  }

  return value
    .map((item, index) => {
      const block = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
      const key = asString(block.key);

      if (!key) {
        return null;
      }

      const type = asString(block.type) as CmsPageBlockType;
      const fallbackBlock = fallbackBlocks.find((candidate) => candidate.key === key);
      return {
        key,
        label: asString(block.label) || fallbackBlock?.label || key,
        type: allowedBlockTypes.has(type) ? type : 'richText',
        sortOrder: typeof block.sortOrder === 'number' ? block.sortOrder : index,
        isActive: block.isActive === undefined ? true : asBoolean(block.isActive),
        data: {
          ...(fallbackBlock?.data || {}),
          ...normalizeBlockData(block.data),
        },
      } satisfies CmsPageBlock;
    })
    .filter((block): block is CmsPageBlock => Boolean(block))
    .sort((first, second) => first.sortOrder - second.sortOrder);
};

const mapPage = (row: CmsPageRow, fallbackPage: CmsPage): CmsPage => {
  const parsedContent = safeParseContent(row.content_json);
  const content = isPlainObject(parsedContent) ? parsedContent : {};
  const blocks = normalizeBlocks(content.blocks, fallbackPage.blocks);

  return {
    id: row.id,
    slug: row.slug,
    title: repairTextEncoding(row.title || fallbackPage.title),
    description: repairTextEncoding(row.description || fallbackPage.description),
    seoTitle: repairTextEncoding(row.seo_title || fallbackPage.seoTitle),
    seoDescription: repairTextEncoding(row.seo_description || fallbackPage.seoDescription),
    status: row.status,
    blocks,
    createdAt: formatTimestamp(row.created_at),
    updatedAt: formatTimestamp(row.updated_at),
  };
};

const normalizePageInput = (slug: CmsPageSlug, payload: unknown): CmsPage => {
  const fallbackPage = defaultPagesBySlug.get(slug);

  if (!fallbackPage) {
    throw new AppError('Pagina nao reconhecida.', 404);
  }

  const data = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;
  const blocks = normalizeBlocks(data.blocks, fallbackPage.blocks);

  return {
    ...fallbackPage,
    title: asString(data.title) || fallbackPage.title,
    description: asString(data.description) || fallbackPage.description,
    seoTitle: asString(data.seoTitle) || fallbackPage.seoTitle,
    seoDescription: asString(data.seoDescription) || fallbackPage.seoDescription,
    status: data.status === 'draft' ? 'draft' : 'published',
    blocks,
  };
};

export const getDefaultCmsPages = () => defaultCmsPages.map((page) => sanitizeContentNode(page) as CmsPage);

export const listCmsPages = async (status?: CmsPageStatus) => {
  const rows = await query<CmsPageRow[]>(
    `
      SELECT *
      FROM cms_pages
      ${status ? 'WHERE status = ?' : ''}
      ORDER BY FIELD(slug, 'home', 'about', 'contact', 'site'), updated_at DESC, id DESC
    `,
    status ? [status] : [],
  );

  const pages = allowedPageSlugs
    .map((slug) => {
      const fallbackPage = defaultPagesBySlug.get(slug)!;
      const row = rows.find((item) => item.slug === slug);
      return row ? mapPage(row, fallbackPage) : fallbackPage;
    })
    .filter((page) => !status || page.status === status);

  return pages.map((page) => sanitizeContentNode(page) as CmsPage);
};

export const getCmsPageBySlug = async (slug: string, status?: CmsPageStatus) => {
  if (!isCmsPageSlug(slug)) {
    return null;
  }

  const pages = await listCmsPages(status);
  return pages.find((page) => page.slug === slug) || null;
};

export const updateCmsPage = async (slug: string, payload: unknown) => {
  if (!isCmsPageSlug(slug)) {
    throw new AppError('Pagina nao reconhecida.', 404);
  }

  const page = normalizePageInput(slug, payload);

  await execute(
    `
      INSERT INTO cms_pages (
        slug,
        title,
        description,
        seo_title,
        seo_description,
        status,
        content_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        seo_title = VALUES(seo_title),
        seo_description = VALUES(seo_description),
        status = VALUES(status),
        content_json = VALUES(content_json)
    `,
    [
      page.slug,
      page.title,
      page.description,
      page.seoTitle,
      page.seoDescription,
      page.status,
      JSON.stringify({ blocks: page.blocks }),
    ],
  );

  const updatedPage = await getCmsPageBySlug(slug);

  if (!updatedPage) {
    throw new AppError('Nao foi possivel carregar a pagina apos salvar.', 500);
  }

  return updatedPage;
};
