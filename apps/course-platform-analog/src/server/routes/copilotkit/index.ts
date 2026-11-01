import { fromWebHandler } from 'h3';
import { copilotRuntimeSingleRouteHandler } from '@course-platform/shared/domain/copilot-server';

// Backs the bare `/api/copilotkit` path. The sibling `[...].ts` catch-all only
// matches `/api/copilotkit/**`, so a POST to the base path 404s without this.
export default fromWebHandler(copilotRuntimeSingleRouteHandler);
