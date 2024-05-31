import { inject } from '@angular/core';
import { createTrpcClient } from '@analogjs/trpc';
import superjson from 'superjson';
import type { AppRouter } from "@course-platform/shared/domain/trpc-server";

export const { provideTrpcClient, tRPCClient } = createTrpcClient<AppRouter>({
	url: '/api/trpc',
	options: {
		transformer: superjson,
	},
});

export function injectTRPCClient() {
	return inject(tRPCClient);
}
