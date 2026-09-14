import { format } from 'node:util';

import type { Logger as ViteLogger, LogErrorOptions, LogOptions } from 'vite';

const LEVELS = ['debug', 'info', 'warn', 'error'] as const;

export type LogLevel = (typeof LEVELS)[number];

const PRETTY = process.stdout.isTTY === true;

export const colorEnabled = PRETTY && !process.env.NO_COLOR;

const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: '\x1b[90m',
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};

const ESCAPE = String.fromCharCode(0x1b);
const VITE_TAG = new RegExp(`^(?:${ESCAPE}\\[[\\d;]*m)*\\[vite\\](?:${ESCAPE}\\[[\\d;]*m)*\\s*`);

const SCOPE_WIDTH = 6;

const minLevel = resolveMinLevel(process.env.LOG_LEVEL);

function resolveMinLevel(value: string | undefined): number {
  const index = LEVELS.indexOf(value as LogLevel);
  if (index !== -1) return index;
  return process.env.NODE_ENV === 'development' ? LEVELS.indexOf('debug') : LEVELS.indexOf('info');
}

function timestamp(now: Date): string {
  if (!PRETTY) return now.toISOString();

  const pad = (value: number, width = 2) => String(value).padStart(width, '0');
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return `${time}.${pad(now.getMilliseconds(), 3)}`;
}

function prefix(level: LogLevel, scope: string): string {
  const time = timestamp(new Date());
  const label = level.toUpperCase().padEnd(5);
  const tag = scope.padEnd(SCOPE_WIDTH);

  return colorEnabled
    ? `${DIM}${time}${RESET} ${LEVEL_COLOR[level]}${label}${RESET} ${DIM}${tag}${RESET}`
    : `${time} ${label} ${tag}`;
}

function write(level: LogLevel, scope: string, args: unknown[]): void {
  if (LEVELS.indexOf(level) < minLevel) return;
  const head = prefix(level, scope);

  const body = format(...args)
    .split('\n')
    .map((line) => `${head} ${line}`)
    .join('\n');

  const stream = level === 'warn' || level === 'error' ? process.stderr : process.stdout;
  stream.write(`${body}\n`);
}

export interface Logger {
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

export function createLogger(scope: string): Logger {
  return {
    debug: (...args) => write('debug', scope, args),
    info: (...args) => write('info', scope, args),
    warn: (...args) => write('warn', scope, args),
    error: (...args) => write('error', scope, args),
  };
}

export function captureConsole(scope = 'app'): void {
  const log = createLogger(scope);
  console.log = (...args: unknown[]) => log.info(...args);
  console.info = (...args: unknown[]) => log.info(...args);
  console.debug = (...args: unknown[]) => log.debug(...args);
  console.warn = (...args: unknown[]) => log.warn(...args);
  console.error = (...args: unknown[]) => log.error(...args);
}

function viteMessage(msg: string, options?: LogOptions): string {
  const message = msg.replace(VITE_TAG, '');
  return options?.environment ? `${options.environment} ${message}` : message;
}

export function createViteLogger(scope = 'vite'): ViteLogger {
  const log = createLogger(scope);
  const warnedMessages = new Set<string>();
  const loggedErrors = new WeakSet<object>();

  const logger: ViteLogger = {
    hasWarned: false,
    info: (msg, options) => log.info(viteMessage(msg, options)),
    warn: (msg, options) => {
      logger.hasWarned = true;
      log.warn(viteMessage(msg, options));
    },
    warnOnce: (msg, options) => {
      if (warnedMessages.has(msg)) return;
      warnedMessages.add(msg);
      logger.hasWarned = true;
      log.warn(viteMessage(msg, options));
    },
    error: (msg, options?: LogErrorOptions) => {
      logger.hasWarned = true;
      if (options?.error) loggedErrors.add(options.error);
      log.error(viteMessage(msg, options));
    },
    clearScreen: () => {},
    hasErrorLogged: (error) => loggedErrors.has(error),
  };

  return logger;
}
