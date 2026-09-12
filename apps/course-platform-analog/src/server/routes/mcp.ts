import {
  getOAuthProtectedResourceMetadataUrl,
  requireBearerAuth,
} from '@modelcontextprotocol/server';
import { fromWebHandler } from 'h3';

import { SupabaseTokenVerifier } from '../mcp/auth';
import { getMcpResourceUrl } from '../mcp/config';
import { courseContentMcpHandler } from '../mcp/server';

const corsHeaders = {
  'Access-Control-Allow-Headers':
    'authorization, content-type, last-event-id, mcp-protocol-version, mcp-session-id',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Expose-Headers': 'mcp-protocol-version, mcp-session-id',
};

export async function handleMcpRequest(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const resourceUrl = getMcpResourceUrl(request);
  const authenticate = requireBearerAuth({
    verifier: new SupabaseTokenVerifier(resourceUrl),
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resourceUrl),
  });
  const authInfo = await authenticate(request);
  const response =
    authInfo instanceof Response
      ? authInfo
      : await courseContentMcpHandler.fetch(request, { authInfo });

  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([name, value]) =>
    headers.set(name, value),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default fromWebHandler(handleMcpRequest);
