import { fromWebHandler } from 'h3';
import { copilotRuntimeHandler } from '@course-platform/shared/domain/copilot-server';

// Analog serves `src/server/routes` under `/api`, so this catch-all backs
// `/api/copilotkit/**` — the `runtimeUrl` configured in `app.config.ts`.
export default fromWebHandler(copilotRuntimeHandler);
