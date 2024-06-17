import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { AuthSBService } from '@course-platform/shared/auth/domain';

export const authGuard =
  (redirectIfAuthenticatedUrl = ''): CanActivateFn =>
  async () => {
    const platformId = inject(PLATFORM_ID);
    const userServerService = inject(AuthSBService);
    const router = inject(Router);

    if (isPlatformBrowser(platformId)) {
      const session = !!(await userServerService.getSession());
      navigateToRedirectUrl(router, redirectIfAuthenticatedUrl);
      if (!session) {
        navigateToLogin();
        return false;
      }

      navigateToRedirectUrl(router, redirectIfAuthenticatedUrl);
      return true;
    }

    const userResponse = await userServerService.authenticateUserSSR();

    if (!userResponse?.data?.user) {
      navigateToLogin();
      return false;
    }

    navigateToRedirectUrl(router, redirectIfAuthenticatedUrl);
    return true;

    function navigateToLogin() {
      console.log('Not authenticated, redirecting to login on server.');
      router.navigate(['login']);
    }

    function navigateToRedirectUrl(
      router: Router,
      redirectIfAuthenticatedUrl: string
    ) {
      if (redirectIfAuthenticatedUrl) {
        console.log('Redirecting to', redirectIfAuthenticatedUrl);
        router.navigate([redirectIfAuthenticatedUrl]);
      }
    }
  };
