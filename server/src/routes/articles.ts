import { Router } from 'express';
import { AppError } from '../middleware/app-error.js';
import { requireAuth } from '../middleware/require-auth.js';
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticleBySlug,
  listArticles,
  updateArticle,
} from '../services/articles-service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { demoArticles, isDatabaseUnavailableError } from '../utils/demo-mode.js';
import { asString } from '../utils/strings.js';

export const articlesRouter = Router();

const resolveArticles = async (status?: 'published' | 'draft') => {
  try {
    return await listArticles(status);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    return demoArticles.filter((article) => !status || article.status === status);
  }
};

const resolveArticleBySlug = async (slug: string) => {
  try {
    return await getArticleBySlug(slug);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    return demoArticles.find((article) => article.slug === slug) || null;
  }
};

const resolveArticleById = async (articleId: number) => {
  try {
    return await getArticleById(articleId);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    return demoArticles.find((article) => article.id === articleId) || null;
  }
};

articlesRouter.get(
  '/public',
  asyncHandler(async (_request, response) => {
    const articles = await resolveArticles('published');
    response.json({ articles });
  }),
);

articlesRouter.get(
  '/public/:slug',
  asyncHandler(async (request, response) => {
    const article = await resolveArticleBySlug(asString(request.params.slug));

    if (!article || article.status !== 'published') {
      throw new AppError('Artigo nao encontrado.', 404);
    }

    response.json({ article });
  }),
);

articlesRouter.use(requireAuth);

articlesRouter.get(
  '/',
  asyncHandler(async (_request, response) => {
    const articles = await resolveArticles();
    response.json({ articles });
  }),
);

articlesRouter.get(
  '/:id',
  asyncHandler(async (request, response) => {
    const article = await resolveArticleById(Number(request.params.id));

    if (!article) {
      throw new AppError('Artigo nao encontrado.', 404);
    }

    response.json({ article });
  }),
);

articlesRouter.post(
  '/',
  asyncHandler(async (request, response) => {
    const article = await createArticle(request.body);
    response.status(201).json({ article });
  }),
);

articlesRouter.put(
  '/:id',
  asyncHandler(async (request, response) => {
    const article = await updateArticle(Number(request.params.id), request.body);
    response.json({ article });
  }),
);

articlesRouter.delete(
  '/:id',
  asyncHandler(async (request, response) => {
    await deleteArticle(Number(request.params.id));
    response.status(204).send();
  }),
);
