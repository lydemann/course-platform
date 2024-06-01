import { router } from '../trpc';
import { courseRouter } from './course-router';
import { sectionRouter } from './sections-router';

export const appRouter = router({
  section: sectionRouter,
  course: courseRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
