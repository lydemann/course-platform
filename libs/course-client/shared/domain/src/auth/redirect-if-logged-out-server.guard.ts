import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { UserServerService } from '@course-platform/shared/auth/domain';

export const redirectIfLoggedOutServerGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    return true;
  }

  const router = inject(Router);
  const ngZone = inject(NgZone);

  const userServerService = inject(UserServerService);
  const isLoggedIn = await userServerService.isLoggedIn();
  if (!isLoggedIn) {
    ngZone.run(() => {
      router.navigate(['login']);
    });
    return false;
  }
  return true;
};
