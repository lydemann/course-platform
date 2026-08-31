import {
  CopilotKitIntelligence,
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

/** Matches ACCESS_TOKEN_COOKIE_KEY in auth-sb.service.ts. */
const ACCESS_TOKEN_COOKIE = 'sb-access-token';

/**
 * Resolves the Supabase JWT, preferring the Authorization header and falling
 * back to the cookie the app already writes for SSR session sharing.
 *
 * The cookie is what makes this reliable. Setting the header depends on
 * `CopilotKit.updateRuntime({ headers })` having run before the sidebar's first
 * request, and it does not: inspecting a real request showed the configured
 * licenseKey present but no authorization header, so every call 401'd. The
 * endpoint is same-origin, so the browser attaches the cookie itself with no
 * ordering to get wrong.
 */
function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (header?.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length).trim();
    if (token) {
      return token;
    }
  }

  const cookie = request.headers.get('cookie');
  if (!cookie) {
    return null;
  }

  for (const part of cookie.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === ACCESS_TOKEN_COOKIE) {
      const value = decodeURIComponent(rest.join('=')).trim();
      return value || null;
    }
  }

  return null;
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

/**
 * CopilotKit Cloud key. Threads are persisted by CopilotKit's Intelligence
 * platform rather than by us, so without this the runtime cannot start.
 *
 * Note the Free plan retains threads for 3 days; a student returning after that
 * sees an empty chat. If permanent history is wanted later, the SSE runtime
 * accepts a custom `runner?: AgentRunner` backed by our own Postgres instead.
 */
const copilotCloudApiKey = process.env['COPILOTKIT_API_KEY'] ?? '';

/**
 * Intelligence mode is only used when a plausible SERVER key is configured.
 *
 * `ck_pub_...` is a publishable key meant for the browser; the Intelligence
 * platform rejects it with CLERK_TOKEN_INVALID, and because thread listing runs
 * on every page load that surfaced as a permanent 500 on
 * `/api/copilotkit/threads` and a console error for the student. Falling back to
 * the SSE runtime keeps the assistant fully working — it only gives up durable
 * threads, which were not working with that key anyway.
 *
 * Set COPILOTKIT_API_KEY to the secret key from the CopilotKit dashboard to
 * enable persistence; this flips over automatically.
 */
const hasCloudServerKey =
  copilotCloudApiKey.length > 0 && !copilotCloudApiKey.startsWith('ck_pub_');

if (!hasCloudServerKey) {
  console.warn(
    '[copilot] COPILOTKIT_API_KEY is unset or is a publishable (ck_pub_) key; ' +
      'running without thread persistence. Set the secret key to enable it.',
  );
}

/** Builds the assistant for the authenticated student on each request. */
const agents = async ({ request }: { request: Request }) => {
  const user = await requireUser(request);

  if (!user) {
    // Unreachable in practice — `onRequest` rejects first. Kept so the agent
    // can never be constructed without a bound user id.
    throw new Error('Copilot agent requested without an authenticated user');
  }

  return { default: createCourseAssistantAgent(user.id) };
};

/**
 * Binds a thread to a student. Uses the same verified Supabase JWT as the rest
 * of the runtime, so a thread can only ever be attributed to the user who
 * actually authenticated.
 */
const identifyUser = async (request: Request) => {
  const user = await requireUser(request);
  if (!user) {
    throw new Error('Copilot thread requested without an authenticated user');
  }
  return { id: user.id, name: user.email ?? user.id };
};

// Two separate constructions rather than a spread: the options type is a
// discriminated union of SSE and Intelligence, and a spread defeats narrowing.
const runtime = hasCloudServerKey
  ? new CopilotRuntime({
      intelligence: new CopilotKitIntelligence({ apiKey: copilotCloudApiKey }),
      generateThreadNames: true,
      identifyUser,
      agents,
    })
  : new CopilotRuntime({ agents });

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
