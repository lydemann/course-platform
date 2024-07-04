import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { AuthSBService } from '../services/auth-sb.service';

const LOGIN_URL = 'login';

export const authSBGuard =
  (redirectIfAuthenticatedUrl = ''): CanActivateFn =>
  async () => {
    const platformId = inject(PLATFORM_ID);
    const authService = inject(AuthSBService);
    const router = inject(Router);

    if (isPlatformBrowser(platformId)) {
      const session = !!(await authService.getSession());
      if (!session) {
        return navigateToLogin();
      }
      navigateToRedirectUrl(router, redirectIfAuthenticatedUrl);
      return true;
    }

    const serverUser = await authService.authenticateUserSSR();
    if (!serverUser) {
      return navigateToLogin();
    }

    navigateToRedirectUrl(router, redirectIfAuthenticatedUrl);
    return true;

    function navigateToLogin() {
      console.log('Not authenticated, redirecting to login on server.');
      router.navigate([LOGIN_URL]);
      return false;
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
