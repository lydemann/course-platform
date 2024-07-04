import { RouteMeta } from '@analogjs/router';
import { LoginComponent } from '@course-platform/course-client/feature';
import { redirectIfLoggedInSBGuard } from '@course-platform/shared/auth/domain';

export const routeMeta: RouteMeta = {
  title: 'Login',
  canActivate: [redirectIfLoggedInSBGuard],
  providers: [],
};

export default LoginComponent;
