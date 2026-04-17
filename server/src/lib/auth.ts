import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { env, isProduction } from '../config/env.js';

export const AUTH_COOKIE_NAME = 'amaral_admin_token';

export interface AuthTokenPayload {
  userId: number;
  email: string;
  role: string;
}

export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export const comparePassword = (password: string, passwordHash: string) => bcrypt.compare(password, passwordHash);

export const signAuthToken = (payload: AuthTokenPayload) =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });

export const verifyAuthToken = (token: string) => jwt.verify(token, env.jwtSecret) as AuthTokenPayload;

export const setAuthCookie = (response: Response, token: string) => {
  response.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

export const clearAuthCookie = (response: Response) => {
  response.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
  });
};
