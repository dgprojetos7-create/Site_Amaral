import type { NextFunction, Request, Response } from 'express';
import { isDatabaseUnavailableError, demoWriteUnavailableMessage } from '../utils/demo-mode.js';
import { AppError } from './app-error.js';

export const errorHandler = (error: Error, _request: Request, response: Response, next: NextFunction) => {
  void next;

  const databaseErrorCode =
    typeof error === 'object' && error && 'code' in error && typeof (error as { code?: unknown }).code === 'string'
      ? (error as { code: string }).code
      : '';

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  if (isDatabaseUnavailableError(error)) {
    console.error(error);

    response.status(503).json({
      error: demoWriteUnavailableMessage,
    });
    return;
  }

  if (databaseErrorCode === 'ER_DATA_TOO_LONG') {
    console.error(error);

    response.status(422).json({
      error: 'Um dos campos enviados excede o limite permitido. Reduza a imagem da capa ou use um arquivo menor.',
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    error: 'Erro interno do servidor.',
  });
};
