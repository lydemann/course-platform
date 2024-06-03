import { RouteMeta } from '@analogjs/router';
import {
  CourseLayoutComponent,
  courseServerResolver,
} from '@course-platform/course-client/feature';
import { authGuard } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  resolve: { courseServerResolver },
  canActivate: [authGuard],
};

export default CourseLayoutComponent;
