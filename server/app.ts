import { RouterContextProvider } from 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');

  app.use(
    createRequestHandler({
      build: () => import('virtual:react-router/server-build'),
      getLoadContext() {
        return new RouterContextProvider();
      },
    }),
  );

  return app;
}
