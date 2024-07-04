import { NgZone, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { isPlatformServer } from '@angular/common';
import { AuthSBService } from '../services/auth-sb.service';

// as canActivate fn
export function redirectIfLoggedInSBGuard(
  redirectTo = 'courses'
): CanActivateFn {
  return () => {
    const platformId = inject(PLATFORM_ID);
    const ngZone = inject(NgZone);
    const authService = inject(AuthSBService);
    const router = inject(Router);

    if (isPlatformServer(platformId)) {
      from(authService.authenticateUserSSR()).pipe(
        first(),
        map((user) => {
          if (user) {
            console.log('Authenticated, redirecting to courses on server.');
            ngZone.run(() => {
              router.navigate([redirectTo]);
            });
            return true;
          }
          return true;
        })
      );
    }

    return from(authService.getUser()).pipe(
      map((currentUser) => {
        if (currentUser) {
          console.log('Authenticated, redirecting to courses on client.');
          router.navigate([redirectTo]);
        }
        return true;
      })
    );
  };
}
