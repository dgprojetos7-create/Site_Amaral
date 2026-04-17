import { Router } from 'express';
import { requireAuth } from '../middleware/require-auth.js';
import { createMedia, deleteMedia, listMedia, updateMedia } from '../services/media-service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { demoMedia, isDatabaseUnavailableError } from '../utils/demo-mode.js';

export const mediaRouter = Router();

mediaRouter.get(
  '/',
  asyncHandler(async (_request, response) => {
    try {
      const media = await listMedia();
      response.json({ media });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      response.json({ media: demoMedia });
    }
  }),
);

mediaRouter.use(requireAuth);

mediaRouter.post(
  '/',
  asyncHandler(async (request, response) => {
    const media = await createMedia(request.body);
    response.status(201).json({ media });
  }),
);

mediaRouter.put(
  '/:id',
  asyncHandler(async (request, response) => {
    const media = await updateMedia(Number(request.params.id), request.body);
    response.json({ media });
  }),
);

mediaRouter.delete(
  '/:id',
  asyncHandler(async (request, response) => {
    await deleteMedia(Number(request.params.id));
    response.status(204).send();
  }),
);
