import { SupabaseClient, createClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Service-role Supabase client, created on first use.
 *
 * Deliberately NOT constructed at module scope. `createClient` always builds a
 * RealtimeClient, which throws on Node runtimes without a native `WebSocket`
 * ("Node.js detected but native WebSocket not found", Node < 22). Because this
 * module sits in the tRPC router import chain, that threw during module load and
 * returned 500 for every procedure — including ones that never touch admin APIs,
 * such as `course.getAll`. Creating it lazily keeps a failure here contained to
 * the one call site that actually needs admin rights.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    client = createClient(
      import.meta.env['VITE_SUPABASE_URL'],
      import.meta.env['SUPABASE_SERVICE_ROLE_KEY'],
    );
  }
  return client;
}
