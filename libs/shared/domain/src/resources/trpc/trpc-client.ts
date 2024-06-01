import { inject } from '@angular/core';
import { createTrpcClient } from '@analogjs/trpc';
import superjson from 'superjson';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@course-platform/shared/domain/trpc-server';

export const { provideTrpcClient, tRPCClient } = createTrpcClient<AppRouter>({
  url: '/api/trpc',
  options: {
    transformer: superjson,
    links: [
      httpBatchLink({
        url: '/api/trpc',
        async fetch(url, options) {
          const response = await fetch(url, {
            ...options,
            credentials: 'include',
          });
          return response;
        },
        headers() {
          return {
            // TODO: set auth token from cookie
            Authorization: 'sometoken',
          };
        },
      }),
    ],
  },
});

export function injectTRPCClient() {
  return inject(tRPCClient);
}
