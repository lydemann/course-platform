import { RouteMeta } from '@analogjs/router';
import { CoursesComponent } from '@course-platform/course-client/feature';

export const routeMeta: RouteMeta = {
  title: 'Courses',
  canActivate: [() => true],
  providers: [],
};

export default CoursesComponent;
