import { RouteMeta } from '@analogjs/router';
import { ProfileComponent } from '@course-platform/course-client/feature';
import { authSBGuard } from '@course-platform/shared/auth/domain';

export const routeMeta: RouteMeta = {
  title: 'Profile',
  canActivate: [authSBGuard],
  providers: [],
};

export default ProfileComponent;
