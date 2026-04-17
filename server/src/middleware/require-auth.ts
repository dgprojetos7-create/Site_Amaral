import type { NextFunction, Request, Response } from 'express';
import { AUTH_COOKIE_NAME, verifyAuthToken } from '../lib/auth.js';
import { AppError } from './app-error.js';

export const requireAuth = (request: Request, _response: Response, next: NextFunction) => {
  const token = request.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    next(new AppError('Sessao administrativa nao encontrada.', 401));
    return;
  }

  try {
    request.authUser = verifyAuthToken(token);
    next();
  } catch {
    next(new AppError('Sessao invalida ou expirada.', 401));
  }
};
