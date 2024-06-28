import { RouteMeta, getLoadResolver } from '@analogjs/router';
import { CoursesComponent } from '@course-platform/course-client/feature';
import { authGuard } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Courses',
  canActivate: [authGuard()],
  resolve: {
    data: async (route) => {
      // call server load resolver for this route from another resolver
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = (await getLoadResolver(route)) as any;

      return { ...data };
    },
  },
};

export default CoursesComponent;
