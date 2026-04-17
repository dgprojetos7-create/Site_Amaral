import type { Article, ArticleStatus } from '../types/cms';

export interface EditableArticleDraft {
  id?: number;
  title: string;
  slug: string;
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

const defaultCategory = 'Artigos';

export const normalizeDateInput = (value: string) => {
  if (!value) {
    return '';
  }

  return value.slice(0, 10);
};

export const formatDisplayDate = (value: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const slugifyArticleTitle = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const stripHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const renderArticleContent = (value: string) => {
  const content = value.trim();

  if (!content) {
    return '';
  }

  if (/<[a-z][\s\S]*>/i.test(content)) {
    return content;
  }

  return content
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('');
};

export const createEmptyArticleDraft = (): EditableArticleDraft => {
  const publishedAt = new Date().toISOString().slice(0, 10);

  return {
    title: '',
    slug: '',
    authorName: '',
    publishedAt,
    displayDate: formatDisplayDate(publishedAt),
    excerpt: '',
    content: '',
    category: defaultCategory,
    tags: [],
    metaTitle: '',
    metaDescription: '',
    imageUrl: '',
    status: 'draft',
  };
};

export const normalizeArticleDraft = (article?: Partial<Article>): EditableArticleDraft => {
  const fallback = createEmptyArticleDraft();

  return {
    id: article?.id,
    title: article?.title || fallback.title,
    slug: article?.slug || fallback.slug,
    authorName: article?.authorName || fallback.authorName,
    publishedAt: normalizeDateInput(article?.publishedAt || fallback.publishedAt),
    displayDate: article?.displayDate || formatDisplayDate(normalizeDateInput(article?.publishedAt || fallback.publishedAt)),
    excerpt: article?.excerpt || fallback.excerpt,
    content: article?.content || fallback.content,
    category: article?.category || fallback.category,
    tags: Array.isArray(article?.tags) ? article.tags : fallback.tags,
    metaTitle: article?.metaTitle || fallback.metaTitle,
    metaDescription: article?.metaDescription || fallback.metaDescription,
    imageUrl: article?.imageUrl || fallback.imageUrl,
    status: article?.status || fallback.status,
  };
};

export const getDraftStorageKey = (articleId?: number) => `site-amaral:article-editor:${articleId || 'new'}`;

export const parseTagsInput = (value: string) =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

export const stringifyTags = (tags: string[]) => tags.join(', ');

export const buildPreviewArticle = (draft: EditableArticleDraft) => ({
  ...draft,
  title: draft.title || 'Titulo do artigo',
  excerpt: draft.excerpt || 'O resumo aparecera aqui quando voce comecar a escrever.',
  content: renderArticleContent(draft.content || '<p>O conteudo do artigo sera exibido aqui.</p>'),
  metaTitle: draft.metaTitle || draft.title,
  metaDescription: draft.metaDescription || stripHtml(draft.excerpt).slice(0, 160),
});
