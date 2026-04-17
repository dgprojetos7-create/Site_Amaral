import { apiRequest } from './client';
import type { Article, AuthUser, Book, CmsPage, DashboardSummary, MediaItem, SiteSections } from '../types/cms';

export const cmsApi = {
  getCurrentUser: async () => (await apiRequest<{ user: AuthUser | null }>('/auth/me')).user,
  login: async (email: string, password: string) =>
    (await apiRequest<{ user: AuthUser }>('/auth/login', { method: 'POST', body: { email, password } })).user,
  logout: async () => {
    await apiRequest<void>('/auth/logout', { method: 'POST' });
  },
  getPublicBooks: async () => (await apiRequest<{ books: Book[] }>('/books/public')).books,
  getPublicBookBySlug: async (slug: string) => (await apiRequest<{ book: Book }>(`/books/public/${slug}`)).book,
  getBooks: async () => (await apiRequest<{ books: Book[] }>('/books')).books,
  createBook: async (book: Partial<Book>) => (await apiRequest<{ book: Book }>('/books', { method: 'POST', body: book })).book,
  updateBook: async (id: number, book: Partial<Book>) =>
    (await apiRequest<{ book: Book }>(`/books/${id}`, { method: 'PUT', body: book })).book,
  deleteBook: async (id: number) => {
    await apiRequest<void>(`/books/${id}`, { method: 'DELETE' });
  },
  getPublicArticles: async () => (await apiRequest<{ articles: Article[] }>('/articles/public')).articles,
  getPublicArticleBySlug: async (slug: string) =>
    (await apiRequest<{ article: Article }>(`/articles/public/${slug}`)).article,
  getArticles: async () => (await apiRequest<{ articles: Article[] }>('/articles')).articles,
  createArticle: async (article: Partial<Article>) =>
    (await apiRequest<{ article: Article }>('/articles', { method: 'POST', body: article })).article,
  updateArticle: async (id: number, article: Partial<Article>) =>
    (await apiRequest<{ article: Article }>(`/articles/${id}`, { method: 'PUT', body: article })).article,
  deleteArticle: async (id: number) => {
    await apiRequest<void>(`/articles/${id}`, { method: 'DELETE' });
  },
  getMedia: async () => (await apiRequest<{ media: MediaItem[] }>('/media')).media,
  createMedia: async (media: Partial<MediaItem>) =>
    (await apiRequest<{ media: MediaItem }>('/media', { method: 'POST', body: media })).media,
  updateMedia: async (id: number, media: Partial<MediaItem>) =>
    (await apiRequest<{ media: MediaItem }>(`/media/${id}`, { method: 'PUT', body: media })).media,
  deleteMedia: async (id: number) => {
    await apiRequest<void>(`/media/${id}`, { method: 'DELETE' });
  },
  getPublicPages: async () => (await apiRequest<{ pages: CmsPage[] }>('/pages/public')).pages,
  getPublicPage: async (slug: string) => (await apiRequest<{ page: CmsPage }>(`/pages/public/${slug}`)).page,
  getPages: async () => (await apiRequest<{ pages: CmsPage[] }>('/pages')).pages,
  getPage: async (slug: string) => (await apiRequest<{ page: CmsPage }>(`/pages/${slug}`)).page,
  updatePage: async (slug: string, page: Partial<CmsPage>) =>
    (await apiRequest<{ page: CmsPage }>(`/pages/${slug}`, { method: 'PUT', body: page })).page,
  getSiteSections: async () => (await apiRequest<{ sections: SiteSections }>('/site-sections')).sections,
  updateSiteSection: async <T>(sectionKey: string, content: T) =>
    (await apiRequest<{ section: T }>(`/site-sections/${sectionKey}`, { method: 'PUT', body: content })).section,
  getDashboardSummary: async () => (await apiRequest<{ summary: DashboardSummary }>('/dashboard/summary')).summary,
};
