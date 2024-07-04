import { RouteMeta, getLoadResolver } from '@analogjs/router';
import { CoursesComponent } from '@course-platform/course-client/feature';
import { authSBGuard } from '@course-platform/shared/auth/domain';

export const routeMeta: RouteMeta = {
  title: 'Courses',
  canActivate: [authSBGuard()],
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
