import {
  CopilotRuntime,
  createCopilotRuntimeHandler,
} from '@copilotkit/runtime/v2';
import type { User } from '@supabase/auth-js';
import { authClient } from '@course-platform/shared/domain/trpc-server';
import { createCourseAssistantAgent } from './course-assistant-agent';

/**
 * Path as the runtime handler sees it — NOT the public URL.
 *
 * The browser calls `/api/copilotkit`, but Analog's Nitro strips the `apiPrefix`
 * before the route handler runs, so the request arrives with pathname
 * `/copilotkit/...`. Setting this to `/api/copilotkit` makes every route fail to
 * match and the handler answers 404 for everything.
 */
export const COPILOT_BASE_PATH = '/copilotkit';

/**
 * The assistant is read-only, but it reads per-student progress, so every
 * request is authenticated with the same Supabase JWT the tRPC layer uses.
 *
 * A chat turn hits this endpoint several times (info, run, connect), so verified
 * tokens are cached briefly to avoid a Supabase round trip per request. The TTL
 * is short enough that a revoked session stops working within a minute.
 */
const TOKEN_CACHE_TTL_MS = 60_000;
const verifiedTokens = new Map<string, { user: User; expiresAt: number }>();

function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return null;
  }
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

async function verifyUser(token: string): Promise<User | null> {
  const now = Date.now();

  const cached = verifiedTokens.get(token);
  if (cached && cached.expiresAt > now) {
    return cached.user;
  }
  if (cached) {
    verifiedTokens.delete(token);
  }

  try {
    const {
      data: { user },
      error,
    } = await authClient.getUser(token);

    if (error || !user) {
      return null;
    }

    verifiedTokens.set(token, { user, expiresAt: now + TOKEN_CACHE_TTL_MS });

    // Bound the map; entries are cheap but this endpoint is public-facing.
    if (verifiedTokens.size > 1000) {
      for (const [key, value] of verifiedTokens) {
        if (value.expiresAt <= now) {
          verifiedTokens.delete(key);
        }
      }
    }

    return user;
  } catch (error) {
    console.error('Copilot token verification failed:', error);
    return null;
  }
}

async function requireUser(request: Request): Promise<User | null> {
  const token = getBearerToken(request);
  return token ? verifyUser(token) : null;
}

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'content-type': 'application/json' },
  });
}

const runtime = new CopilotRuntime({
  agents: async ({ request }) => {
    const user = await requireUser(request);

    if (!user) {
      // Unreachable in practice — `onRequest` rejects first. Kept so the agent
      // can never be constructed without a bound user id.
      throw new Error('Copilot agent requested without an authenticated user');
    }

    return { default: createCourseAssistantAgent(user.id) };
  },
});

const hooks = {
  onRequest: async ({ request }: { request: Request }) => {
    const user = await requireUser(request);
    if (!user) {
      // The hook contract short-circuits on a thrown Response.
      throw unauthorized();
    }
  },
};

/**
 * Multi-route transport: `/api/copilotkit/info`, `/api/copilotkit/agent/:id/run`
 * and friends. Backs the Nitro catch-all route.
 */
export const copilotRuntimeHandler = createCopilotRuntimeHandler({
  runtime,
  basePath: COPILOT_BASE_PATH,
  hooks,
});

/**
 * Single-route transport: one POST to the base path carrying a
 * `{ method, params, body }` envelope. The Angular client uses this when its
 * `runtimeTransport` is `single`, and Nitro's `[...]` catch-all does NOT match
 * the bare `/api/copilotkit` path, so it needs its own route file.
 */
export const copilotRuntimeSingleRouteHandler = createCopilotRuntimeHandler({
  runtime,
  basePath: COPILOT_BASE_PATH,
  mode: 'single-route',
  hooks,
});
