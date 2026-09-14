import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import compression from 'compression';
import express, { type NextFunction, type Request, type Response } from 'express';
import morgan from 'morgan';

import { captureConsole, colorEnabled, createLogger, createViteLogger } from './server/logger.js';

const BUILD_PATH = pathToFileURL(resolve('build/server/index.js')).href;
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '20099');

const VITE_INTERNAL = /^\/(?:@|node_modules\/|\.vite\/)/;

captureConsole();

const log = createLogger('server');
const httpLog = createLogger('http');

const requestFormat: morgan.FormatFn<Request, Response> = (tokens, request, response) => {
  const status = response.statusCode;
  const color = status >= 500 ? 31 : status >= 400 ? 33 : status >= 300 ? 36 : 32;
  const size = response.getHeader('content-length');

  const parts = [
    tokens.method(request, response) ?? '-',
    tokens.url(request, response) ?? '-',
    colorEnabled ? `\x1b[${color}m${status}\x1b[0m` : String(status),
    `${tokens['response-time'](request, response) ?? '-'} ms`,
  ];
  if (size) parts.push(`${size} B`);

  return parts.join(' ');
};

const app = express();

app.use(compression());
app.disable('x-powered-by');

app.use(
  morgan(requestFormat, {
    stream: { write: (line) => httpLog.info(line.trimEnd()) },
    skip: (request) => DEVELOPMENT && VITE_INTERNAL.test(request.url),
  }),
);

if (DEVELOPMENT) {
  log.info('Starting development server');

  const viteDevServer = await import('vite').then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
      customLogger: createViteLogger(),
    }),
  );

  app.use(viteDevServer.middlewares);

  let cached: { source: object; handler: express.Express } | undefined;

  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule('./server/app.ts');

      if (cached?.source !== source) {
        cached = { source, handler: source.createApp() };
      }
      return await cached.handler(req, res, next);
    } catch (error) {
      if (typeof error === 'object' && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  log.info('Starting production server');

  app.use('/assets', express.static('build/client/assets', { immutable: true, maxAge: '1y' }));
  app.use('/fonts', express.static('build/client/fonts', { immutable: true, maxAge: '1y' }));
  app.use(express.static('build/client', { maxAge: '7d' }));
  app.use(await import(BUILD_PATH).then((mod) => mod.createApp()));
}

app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
  log.error(error);
  if (response.headersSent) return next(error);
  response.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  log.info(`Server is running on http://localhost:${PORT}`);
});
