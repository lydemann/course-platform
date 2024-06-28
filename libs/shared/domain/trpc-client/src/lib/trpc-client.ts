import { inject } from '@angular/core';
import superjson from 'superjson';
import type { AppRouter } from '@course-platform/shared/domain/trpc-server';
import { createTrpcClient } from '@analogjs/trpc';

export const { provideTrpcClient, tRPCClient, TrpcHeaders } =
  createTrpcClient<AppRouter>({
    url: '/api/trpc',
    options: {
      transformer: superjson,
    },
  });

export function injectTRPCClient() {
  return inject(tRPCClient);
}
