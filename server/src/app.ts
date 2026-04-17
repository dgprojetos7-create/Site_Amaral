import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { articlesRouter } from './routes/articles.js';
import { authRouter } from './routes/auth.js';
import { booksRouter } from './routes/books.js';
import { dashboardRouter } from './routes/dashboard.js';
import { mediaRouter } from './routes/media.js';
import { pagesRouter } from './routes/pages.js';
import { siteSectionsRouter } from './routes/site-sections.js';

export const app = express();

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
  });
});

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/media', mediaRouter);
app.use('/api/pages', pagesRouter);
app.use('/api/site-sections', siteSectionsRouter);
app.use('/api/dashboard', dashboardRouter);

app.use('/api', notFoundHandler);
app.use(errorHandler);
