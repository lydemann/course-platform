import {
  getMcpDocumentationUrl,
  getMcpResourceUrl,
  getSupabaseAuthUrl,
} from './config';

export function buildProtectedResourceMetadata(request: Request) {
  return {
    resource: getMcpResourceUrl(request).toString(),
    authorization_servers: [getSupabaseAuthUrl().toString()],
    resource_name: 'Angular Architect Accelerator course content',
    resource_documentation: getMcpDocumentationUrl(request).toString(),
  };
}
