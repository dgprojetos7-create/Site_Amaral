import { Router } from 'express';
import { AppError } from '../middleware/app-error.js';
import { requireAuth } from '../middleware/require-auth.js';
import { createBook, deleteBook, getBookById, getBookBySlug, listBooks, updateBook } from '../services/books-service.js';
import { asyncHandler } from '../utils/async-handler.js';
import { demoBooks, isDatabaseUnavailableError } from '../utils/demo-mode.js';
import { asString } from '../utils/strings.js';

export const booksRouter = Router();

const resolveBooks = async (status?: 'published' | 'draft') => {
  try {
    return await listBooks(status);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    return demoBooks.filter((book) => !status || book.status === status);
  }
};

const resolveBookBySlug = async (slug: string) => {
  try {
    return await getBookBySlug(slug);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    return demoBooks.find((book) => book.slug === slug) || null;
  }
};

const resolveBookById = async (bookId: number) => {
  try {
    return await getBookById(bookId);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) {
      throw error;
    }

    return demoBooks.find((book) => book.id === bookId) || null;
  }
};

booksRouter.get(
  '/public',
  asyncHandler(async (_request, response) => {
    const books = await resolveBooks('published');
    response.json({ books });
  }),
);

booksRouter.get(
  '/public/:slug',
  asyncHandler(async (request, response) => {
    const book = await resolveBookBySlug(asString(request.params.slug));

    if (!book || book.status !== 'published') {
      throw new AppError('Livro nao encontrado.', 404);
    }

    response.json({ book });
  }),
);

booksRouter.use(requireAuth);

booksRouter.get(
  '/',
  asyncHandler(async (_request, response) => {
    const books = await resolveBooks();
    response.json({ books });
  }),
);

booksRouter.get(
  '/:id',
  asyncHandler(async (request, response) => {
    const book = await resolveBookById(Number(request.params.id));

    if (!book) {
      throw new AppError('Livro nao encontrado.', 404);
    }

    response.json({ book });
  }),
);

booksRouter.post(
  '/',
  asyncHandler(async (request, response) => {
    const book = await createBook(request.body);
    response.status(201).json({ book });
  }),
);

booksRouter.put(
  '/:id',
  asyncHandler(async (request, response) => {
    const book = await updateBook(Number(request.params.id), request.body);
    response.json({ book });
  }),
);

booksRouter.delete(
  '/:id',
  asyncHandler(async (request, response) => {
    await deleteBook(Number(request.params.id));
    response.status(204).send();
  }),
);
