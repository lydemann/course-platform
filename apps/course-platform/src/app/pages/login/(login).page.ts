import { RouteMeta } from '@analogjs/router';
import { LoginComponent } from '@course-platform/course-client/feature';
import { RedirectIfAuthenticatedResolver } from '@course-platform/course-client/shared/domain';

export const routeMeta: RouteMeta = {
  title: 'Login',
  resolve: [RedirectIfAuthenticatedResolver],
  providers: [],
};

export default LoginComponent;
