import { z } from 'zod';

import { DEFAULT_REPOSITORY } from './site.shared';

const optionalString = z
  .string()
  .trim()
  .transform((value) => value || undefined)
  .optional();

const envSchema = z.object({
  SITE_URL: optionalString.pipe(z.url().optional()),
  GITHUB_REPOSITORY: z
    .string()
    .trim()
    .regex(/^[\w.-]+\/[\w.-]+$/)
    .default(DEFAULT_REPOSITORY),
  GITHUB_TOKEN: optionalString,
  GITHUB_CACHE_TTL: z.coerce.number().int().nonnegative().default(600),
  GITHUB_RELEASES_FIXTURE: optionalString,
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);
