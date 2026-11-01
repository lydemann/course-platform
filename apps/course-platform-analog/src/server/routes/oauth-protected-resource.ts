import { defineEventHandler, getRequestURL, setResponseHeaders } from 'h3';

import { buildProtectedResourceMetadata } from '../mcp/metadata';

export default defineEventHandler((event) => {
  const requestUrl = getRequestURL(event);
  const request = new Request(requestUrl);

  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  });

  return buildProtectedResourceMetadata(request);
});
