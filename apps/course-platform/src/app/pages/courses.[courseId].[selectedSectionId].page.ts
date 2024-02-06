import { RouteMeta } from '@analogjs/router';
import {
  CourseLayoutComponent,
  courseServerResolver,
} from '@course-platform/course-client/feature';

export const routeMeta: RouteMeta = {
  resolve: { courseServerResolver },
};

export default CourseLayoutComponent;
