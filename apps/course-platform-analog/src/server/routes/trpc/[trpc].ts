/* eslint-disable @nx/enforce-module-boundaries */
import { createTrpcNitroHandler } from '@analogjs/trpc';
import {
  appRouter,
  createContext,
} from '@course-platform/shared/domain/trpc-server';

// export API handler
export default createTrpcNitroHandler({
  router: appRouter,
  createContext,
});
