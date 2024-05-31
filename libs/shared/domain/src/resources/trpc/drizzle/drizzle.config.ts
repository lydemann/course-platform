import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite"
  schema: './db-schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: 'postgres://postgres.oyhrskqqrtwewkczdlxo:z1buXk6K8*cG9FPS@aws-0-eu-central-1.pooler.supabase.com:5432/postgres',
  },
});
