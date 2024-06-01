import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { UserServerService } from '@course-platform/shared/auth/domain';

export const redirectIfLoggedInServerGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    return true;
  }

  const userServerService = inject(UserServerService);
  const router = inject(Router);
  const ngZone = inject(NgZone);
  const isLoggedIn = await userServerService.isLoggedIn();
  if (isLoggedIn) {
    console.log('Authenticated, redirecting to courses on server.');
    ngZone.run(() => {
      router.navigate(['courses']);
    });
    return false;
  }
  return true;
};
