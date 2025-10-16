import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import apiDocsRouter from './routers/apiDocs.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const startServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  // Logger
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  // Routes
  app.use('/auth', authRouter);
  app.use('/api-docs', apiDocsRouter);
  app.use(contactsRouter);

  // 404 handler for non-existent routes
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
