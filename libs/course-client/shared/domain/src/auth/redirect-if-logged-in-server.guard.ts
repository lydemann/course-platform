import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformServer } from '@angular/common';
import { UserServerService } from '@course-platform/shared/auth/domain';

export const redirectIfLoggedInServerGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformServer(platformId)) {
    const userServerService = inject(UserServerService);
    const router = inject(Router);
    const ngZone = inject(NgZone);
    const isLoggedIn = await userServerService.isLoggedIn();
    if (isLoggedIn) {
      ngZone.run(() => {
        router.navigate(['courses']);
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
