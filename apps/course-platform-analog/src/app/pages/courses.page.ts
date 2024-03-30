import { RouteMeta } from '@analogjs/router';
import { CoursesComponent } from '@course-platform/course-client/feature';
import { redirectIfLoggedOutServerGuard } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Courses',
  canActivate: [redirectIfLoggedOutServerGuard],
  providers: [],
};

export default CoursesComponent;
