import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { AuthSBService } from '@course-platform/shared/auth/domain';

export const authGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  const userServerService = inject(AuthSBService);
  const router = inject(Router);
  const ngZone = inject(NgZone);

  if (isPlatformBrowser(platformId)) {
    const browserSession = await userServerService.getSession();
    if (browserSession.data.session) {
      return true;
    }
    console.log('Not authenticated, redirecting to login on browser.');
    navigateToLogin();
    return false;
  }

  const isLoggedIn = await userServerService.authenticateUserSSR();
  if (!isLoggedIn) {
    console.log('Not authenticated, redirecting to login on server.');
    navigateToLogin();
    return false;
  }
  return true;

  function navigateToLogin() {
    ngZone.run(() => {
      router.navigate(['login']);
    });
  }
};
