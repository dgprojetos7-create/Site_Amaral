export type BookStatus = 'published' | 'draft';
export type ArticleStatus = 'published' | 'draft';
export type MediaType = 'image' | 'video' | 'external';
export type CmsPageStatus = 'published' | 'draft';
export type CmsPageSlug = 'home' | 'about' | 'contact' | 'site';
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

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
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

export interface MediaItem {
  id: number;
  title: string;
  altText: string;
  url: string;
  mediaType: MediaType;
  createdAt: string;
  updatedAt: string;
}

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

export interface SiteSections {
  homeHero: {
    title: string;
    subtitle: string;
  };
  about: {
    trajetoria: string;
    transicao: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface DashboardSummary {
  counts: {
    books: number;
    publishedBooks: number;
    draftBooks: number;
    articles: number;
    publishedArticles: number;
    draftArticles: number;
    media: number;
  };
  recentBooks: Book[];
  recentArticles: Article[];
  sections: SiteSections;
}
