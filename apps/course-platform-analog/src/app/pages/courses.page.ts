import { RouteMeta } from '@analogjs/router';
import { CoursesComponent } from '@course-platform/course-client/feature';
import { authGuard } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Courses',
  canActivate: [authGuard()],
};

export default CoursesComponent;
