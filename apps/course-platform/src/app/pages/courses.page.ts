import { RouteMeta } from '@analogjs/router';
import { CoursesComponent } from '@course-platform/course-client/feature';
import { RedirectIfLoggedOutResolver } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Courses',
  resolve: [RedirectIfLoggedOutResolver],
  providers: [],
};

export default CoursesComponent;
