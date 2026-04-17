import { Router } from 'express';
import { requireAuth } from '../middleware/require-auth.js';
import { listSiteSections, updateSiteSection } from '../services/site-sections-service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { demoSiteSections, isDatabaseUnavailableError } from '../utils/demo-mode.js';
import { asString } from '../utils/strings.js';

export const siteSectionsRouter = Router();

siteSectionsRouter.get(
  '/',
  asyncHandler(async (_request, response) => {
    try {
      const sections = await listSiteSections();
      response.json({ sections });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      response.json({ sections: demoSiteSections });
    }
  }),
);

siteSectionsRouter.put(
  '/:sectionKey',
  requireAuth,
  asyncHandler(async (request, response) => {
    const section = await updateSiteSection(asString(request.params.sectionKey), request.body);
    response.json({ section });
  }),
);
