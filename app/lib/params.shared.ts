import type { z } from 'zod';

export function parseParams<S extends z.ZodType>(schema: S, params: unknown): z.output<S> {
  const result = schema.safeParse(params);
  if (!result.success) throw new Response('Not Found', { status: 404 });

  return result.data;
}
