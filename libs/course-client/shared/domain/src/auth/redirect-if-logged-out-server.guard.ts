import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformServer } from '@angular/common';
import { UserServerService } from '@course-platform/shared/auth/domain';

export const redirectIfLoggedOutServerGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const ngZone = inject(NgZone);
  if (isPlatformServer(platformId)) {
    const userServerService = inject(UserServerService);
    const isLoggedIn = await userServerService.isLoggedIn();
    if (!isLoggedIn) {
      ngZone.run(() => {
        router.navigate(['login']);
      });
      return false;
    }
    return true;
  } else {
    // For client-side, you might have a different logic.
    // You can handle it accordingly.
    return true; // Or any other logic for client-side
  }
};
