import { RouteMeta } from '@analogjs/router';
import {
  CourseLayoutComponent,
  courseServerResolver,
} from '@course-platform/course-client/feature';
import { authSBGuard } from '@course-platform/shared/auth/domain';

export const routeMeta: RouteMeta = {
  resolve: { courseServerResolver },
  canActivate: [authSBGuard()],
};

export default CourseLayoutComponent;
