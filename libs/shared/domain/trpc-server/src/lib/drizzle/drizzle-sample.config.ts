// rename to drizzle.config.ts and fill out url
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite"
  schema: './out/schema.ts',
  // fill out your database credentials
  out: './out',
  // dbCredentials: {
  // url: 'postgres://...',
  // },
});
