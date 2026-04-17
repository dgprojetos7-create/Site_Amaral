/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import { cmsApi } from '../api/cms';
import { buildSiteSectionsFromPages } from '../lib/cms-pages';
import type { Article, Book, CmsPage, MediaItem, SiteSections } from '../types/cms';

interface PublicSiteContextValue {
  books: Book[];
  articles: Article[];
  media: MediaItem[];
  pages: CmsPage[];
  siteSections: SiteSections | null;
  isLoading: boolean;
  error: string;
  refresh: () => Promise<void>;
}

export const PublicSiteContext = createContext<PublicSiteContextValue | undefined>(undefined);

export const PublicSiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [siteSections, setSiteSections] = useState<SiteSections | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPublicSite = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [nextBooks, nextArticles, nextMedia, nextPages] = await Promise.all([
        cmsApi.getPublicBooks(),
        cmsApi.getPublicArticles(),
        cmsApi.getMedia(),
        cmsApi.getPublicPages(),
      ]);

      setBooks(nextBooks);
      setArticles(nextArticles);
      setMedia(nextMedia);
      setPages(nextPages);
      setSiteSections(buildSiteSectionsFromPages(nextPages));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível carregar o site.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPublicSite();
  }, []);

  return (
    <PublicSiteContext.Provider
      value={{
        books,
        articles,
        media,
        pages,
        siteSections,
        isLoading,
        error,
        refresh: loadPublicSite,
      }}
    >
      {children}
    </PublicSiteContext.Provider>
  );
};
