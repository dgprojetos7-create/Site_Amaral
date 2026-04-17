import type { AuthTokenPayload } from '../lib/auth.js';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthTokenPayload;
    }
  }
}

export {};
