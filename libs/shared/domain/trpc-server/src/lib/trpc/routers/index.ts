import { router } from '../trpc';
import { courseRouter } from './course-router';
import { lessonRouter } from './lessons-router';
import { sectionRouter } from './sections-router';
import { userRouter } from './user-router';

export const appRouter = router({
  section: sectionRouter,
  course: courseRouter,
  lesson: lessonRouter,
  user: userRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
