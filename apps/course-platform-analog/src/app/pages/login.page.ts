import { RouteMeta } from '@analogjs/router';
import { LoginComponent } from '@course-platform/course-client/feature';
import { redirectIfLoggedInServerGuard } from '@course-platform/shared/auth/domain';

export const routeMeta: RouteMeta = {
  title: 'Login',
  canActivate: [redirectIfLoggedInServerGuard],
  providers: [],
};

export default LoginComponent;
