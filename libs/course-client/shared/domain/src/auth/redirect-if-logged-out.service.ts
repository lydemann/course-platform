import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { isPlatformServer } from '@angular/common';
import { UserService } from '@course-platform/shared/auth-domain';

@Injectable({ providedIn: 'root' })
export class RedirectIfLoggedOutResolver implements Resolve<boolean> {
  private platformId = inject(PLATFORM_ID);
  constructor(
    public afAuth: Auth,
    public userService: UserService,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }

    return this.userService.currentUser$.pipe(
      first(),
      map((currentUser) => {
        if (!currentUser) {
          this.router.navigate(['login']);
          return false;
        }
        return true;
      })
    );
  }
}
