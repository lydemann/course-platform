import { defineEventHandler, getRequestURL, setResponseHeaders } from 'h3';

import { buildProtectedResourceMetadata } from '../mcp/metadata';

const protectedResourcePaths = new Set([
  '/.well-known/oauth-protected-resource',
  '/.well-known/oauth-protected-resource/api/mcp',
]);

export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event);
  if (!protectedResourcePaths.has(requestUrl.pathname)) {
    return;
  }

  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json',
  });

  return buildProtectedResourceMetadata(new Request(requestUrl));
});
