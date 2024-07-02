import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { isPlatformServer } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectIfLoggedInResolver implements Resolve<boolean> {
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);
  constructor(
    public afAuth: Auth,
    public authService: AuthService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      from(this.authService.authenticateUserSSR()).pipe(
        first(),
        map((isLoggedIn) => {
          if (isLoggedIn) {
            console.log('Authenticated, redirecting to courses on server.');
            this.ngZone.run(() => {
              this.router.navigate(['courses']);
            });
            return true;
          }
          return true;
        })
      );
    }

    return from(this.authService.getUser()).pipe(
      map((currentUser) => {
        if (currentUser) {
          console.log('Authenticated, redirecting to courses on client.');
          this.router.navigate(['courses']);
        }
        return true;
      })
    );
  }
}
