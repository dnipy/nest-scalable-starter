import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  // APP_PUBLIC_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1), // pooler
  // DATABASE_DIRECT_URL: z.string().min(1), // the actual db
  // JWT_SECRET: z.string().min(16),
  // JWT_EXPIRES_IN: z.coerce.number().positive(),
  // OPENAI_API_KEY: z.string().startsWith('sk-'),
  // MONGO_URI: z.string().min(1),
  // MONGO_USER: z.string().min(1),
  // MONGO_PASSWORD: z.string().min(1),
  // MONGO_DB: z.string().min(1),
  // REDIS_HOST: z.string().min(1),
  // REDIS_PORT: z.coerce.number().positive(),
  // LOCAL_SECRET: z.string().min(16),
  // TELEGRAM_BOT_TOKEN: z.string().min(1),
  // TELEGRAM_CHAT_ID: z.coerce.number().positive(),
  // BALE_BOT_TOKEN: z.string().min(1),
  // BALE_CHAT_ID: z.coerce.number().positive(),
  // CF_SECRET_KEY: z.string().min(1),
  // // admin
  // DEFAULT_ADMIN_PHONE: z.string().length(11),
  // DEFAULT_ADMIN_NATIONAL_CODE: z.string().length(10),
  // DEFAULT_ADMIN_PASSWORD: z.string().trim().min(8),
  // //bullboard
  // BULLBOARD_USER: z.string().trim().min(5),
  // BULLBOARD_PASSWORD: z.string().trim().min(8),
  // ENABLE_CAPTCHA: z.string().default('true'),
  // // storage
  // STORAGE_REGION: z.string().default('us-east-1'),
  // STORAGE_ENDPOINT: z.string().optional(),
  // STORAGE_ACCESS_KEY: z.string().min(1),
  // STORAGE_SECRET_KEY: z.string().min(1),
  // // buckets
  // S3_BUCKET_DOCUMENT: z.string().default('langoo-documents'),
  // S3_BUCKET_BACKUP: z.string().default('langoo-backups'),
  // S3_BUCKET_LOG: z.string().default('langoo-logs'),
});

export type Env = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error(
      '❌ Invalid environment variables:',
      result.error.flatten().fieldErrors,
    );

    throw new Error('Invalid config');
  }

  return result.data;
}
