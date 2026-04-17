import { Router } from 'express';
import { AppError } from '../middleware/app-error.js';
import { requireAuth } from '../middleware/require-auth.js';
import {
  getCmsPageBySlug,
  getDefaultCmsPages,
  listCmsPages,
  updateCmsPage,
} from '../services/cms-pages-service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { isDatabaseUnavailableError } from '../utils/demo-mode.js';
import { asString } from '../utils/strings.js';

export const pagesRouter = Router();

pagesRouter.get(
  '/public',
  asyncHandler(async (_request, response) => {
    try {
      const pages = await listCmsPages('published');
      response.json({ pages });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      response.json({ pages: getDefaultCmsPages().filter((page) => page.status === 'published') });
    }
  }),
);

pagesRouter.get(
  '/public/:slug',
  asyncHandler(async (request, response) => {
    try {
      const page = await getCmsPageBySlug(asString(request.params.slug), 'published');

      if (!page) {
        throw new AppError('Pagina nao encontrada.', 404);
      }

      response.json({ page });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      const page = getDefaultCmsPages().find((item) => item.slug === asString(request.params.slug) && item.status === 'published');

      if (!page) {
        throw new AppError('Pagina nao encontrada.', 404);
      }

      response.json({ page });
    }
  }),
);

pagesRouter.use(requireAuth);

pagesRouter.get(
  '/',
  asyncHandler(async (_request, response) => {
    try {
      const pages = await listCmsPages();
      response.json({ pages });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      response.json({ pages: getDefaultCmsPages() });
    }
  }),
);

pagesRouter.get(
  '/:slug',
  asyncHandler(async (request, response) => {
    try {
      const page = await getCmsPageBySlug(asString(request.params.slug));

      if (!page) {
        throw new AppError('Pagina nao encontrada.', 404);
      }

      response.json({ page });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      const page = getDefaultCmsPages().find((item) => item.slug === asString(request.params.slug));

      if (!page) {
        throw new AppError('Pagina nao encontrada.', 404);
      }

      response.json({ page });
    }
  }),
);

pagesRouter.put(
  '/:slug',
  asyncHandler(async (request, response) => {
    const page = await updateCmsPage(asString(request.params.slug), request.body);
    response.json({ page });
  }),
);
