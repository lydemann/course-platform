import { RouteMeta } from '@analogjs/router';
import {
  CourseLayoutComponent,
  courseServerResolver,
} from '@course-platform/course-client/feature';
import { redirectIfLoggedOutServerGuard } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  resolve: { courseServerResolver },
  canActivate: [redirectIfLoggedOutServerGuard],
};

export default CourseLayoutComponent;
