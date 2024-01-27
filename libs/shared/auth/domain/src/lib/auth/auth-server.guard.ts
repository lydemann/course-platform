import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { isPlatformServer } from '@angular/common';
import { REQUEST } from '@course-platform/shared/ssr/domain';
import { UserService } from './user.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const request = inject(REQUEST);

  return true;
};

@Injectable({
  providedIn: 'root',
})
export class AuthServerGuard {
  private platformId = inject(PLATFORM_ID);
  private request = inject(REQUEST);
  constructor(public userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      const token = this.request.headers.getSetCookie()[0];
      // use firebase admin tool to verify token

      if (token) {
        return of(true);
      }
    }

    return this.userService.currentUser$.pipe(
      first(),
      map((currentUser) => {
        if (!currentUser) {
          this.router.navigate(['login']);
        }
        return !!currentUser;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
