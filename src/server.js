import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import contactsRouter from './routers/contacts.js';

export const startServer = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Logger
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  // Routes
  app.use(contactsRouter);

  // 404 handler for non-existent routes
  app.use('*', (req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
