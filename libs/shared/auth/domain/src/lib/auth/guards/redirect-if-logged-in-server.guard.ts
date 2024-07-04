import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const redirectIfLoggedInServerGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    return true;
  }

  const router = inject(Router);
  const ngZone = inject(NgZone);
  const authService = inject(AuthService);
  const isLoggedIn = await authService.authenticateUserSSR();
  if (isLoggedIn) {
    console.log('Authenticated, redirecting to courses on server.');
    ngZone.run(() => {
      router.navigate(['courses']);
    });
    return true;
  }
  return true;
};
