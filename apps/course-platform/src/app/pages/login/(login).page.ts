import { RouteMeta } from '@analogjs/router';
import { LoginComponent } from '@course-platform/course-client/feature';

export const routeMeta: RouteMeta = {
  title: 'Login',
  canActivate: [() => true],
  providers: [],
};

export default LoginComponent;
