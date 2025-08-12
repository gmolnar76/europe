import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://europa:devpass@localhost:5432/europa_vote'
  },
  verbose: true,
  strict: true
} satisfies Config;
