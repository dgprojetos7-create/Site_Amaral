import { Router } from 'express';
import { requireAuth } from '../middleware/require-auth.js';
import { listArticles } from '../services/articles-service.js';
import { listBooks } from '../services/books-service.js';
import { listMedia } from '../services/media-service.js';
import { listSiteSections } from '../services/site-sections-service.js';
import { asyncHandler } from '../utils/async-handler.js';
import {
  demoArticles,
  demoBooks,
  demoMedia,
  demoSiteSections,
  getDemoDashboardSummary,
  isDatabaseUnavailableError,
} from '../utils/demo-mode.js';

export const dashboardRouter = Router();

dashboardRouter.use(requireAuth);

dashboardRouter.get(
  '/summary',
  asyncHandler(async (_request, response) => {
    try {
      const [books, articles, media, sections] = await Promise.all([
        listBooks(),
        listArticles(),
        listMedia(),
        listSiteSections(),
      ]);

      response.json({
        summary: {
          counts: {
            books: books.length,
            publishedBooks: books.filter((book) => book.status === 'published').length,
            draftBooks: books.filter((book) => book.status === 'draft').length,
            articles: articles.length,
            publishedArticles: articles.filter((article) => article.status === 'published').length,
            draftArticles: articles.filter((article) => article.status === 'draft').length,
            media: media.length,
          },
          recentBooks: books.slice(0, 4),
          recentArticles: articles.slice(0, 4),
          sections,
        },
      });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      void demoBooks;
      void demoArticles;
      void demoMedia;
      void demoSiteSections;
      response.json({ summary: getDemoDashboardSummary() });
    }
  }),
);
