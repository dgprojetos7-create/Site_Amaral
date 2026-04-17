import { Router } from 'express';
import { env } from '../config/env.js';
import { clearAuthCookie, setAuthCookie, signAuthToken } from '../lib/auth.js';
import { AppError } from '../middleware/app-error.js';
import { requireAuth } from '../middleware/require-auth.js';
import { findUserById, loginAdmin } from '../services/auth-service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { getDemoAdminUser, isDatabaseUnavailableError } from '../utils/demo-mode.js';
import { asString } from '../utils/strings.js';

export const authRouter = Router();

const respondWithUser = (response: Parameters<typeof setAuthCookie>[0], user: ReturnType<typeof getDemoAdminUser>) => {
  const token = signAuthToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  setAuthCookie(response, token);
  response.json({ user });
};

authRouter.post(
  '/login',
  asyncHandler(async (request, response) => {
    const email = asString(request.body?.email);
    const password = asString(request.body?.password);

    try {
      const user = await loginAdmin(email, password);
      respondWithUser(response, user);
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      if (email !== env.adminSeed.email || password !== env.adminSeed.password) {
        throw new AppError('Credenciais invalidas.', 401);
      }

      respondWithUser(response, getDemoAdminUser());
    }
  }),
);

authRouter.post('/logout', (_request, response) => {
  clearAuthCookie(response);
  response.status(204).send();
});

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (request, response) => {
    try {
      const user = await findUserById(request.authUser!.userId);
      response.json({ user });
    } catch (error) {
      if (!isDatabaseUnavailableError(error)) {
        throw error;
      }

      response.json({ user: getDemoAdminUser() });
    }
  }),
);
