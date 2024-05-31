// rename to drizzle.config.ts and fill out url
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite"
  schema: './db-schema.ts',
  // fill out your database credentials
  out: './drizzle',
  // dbCredentials: {
  // url: 'postgres://...',
  // },
});
