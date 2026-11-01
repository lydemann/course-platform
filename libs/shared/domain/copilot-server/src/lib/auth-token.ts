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
export function getBearerToken(request: Request): string | null {
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
      try {
        const value = decodeURIComponent(rest.join('=')).trim();
        return value || null;
      } catch {
        return null;
      }
    }
  }

  return null;
}
