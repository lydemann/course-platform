const buildTimeEnv = import.meta.env || {};

export function readServerEnv(name: string): string | undefined {
  const value = process.env[name] ?? buildTimeEnv[name];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function getSupabaseAuthUrl(): URL {
  const supabaseUrl = readServerEnv('VITE_SUPABASE_URL');
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is required for MCP authentication.');
  }

  return new URL('/auth/v1', ensureTrailingSlash(supabaseUrl));
}

export function getMcpResourceUrl(request: Request): URL {
  const configuredUrl = readServerEnv('MCP_RESOURCE_URL');
  return configuredUrl
    ? new URL(configuredUrl)
    : new URL('/api/mcp', request.url);
}

export function getMcpDocumentationUrl(request: Request): URL {
  return new URL('/docs/course-content-mcp.md', request.url);
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}
