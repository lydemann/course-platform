import { type InferSelectModel } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './db-schema';

export type Sections = InferSelectModel<typeof schema.sections>;

// biome-ignore lint/complexity/useLiteralKeys: <explanation>
const client = postgres(process.env['DATABASE_URL'] ?? '');
export const db = drizzle(client, { schema });
