import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { isPlatformServer } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RedirectIfLoggedOutResolver implements Resolve<boolean> {
  private platformId = inject(PLATFORM_ID);
  constructor(
    public afAuth: Auth,
    public userService: AuthService,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }

    return from(this.userService.getUser()).pipe(
      first(),
      map((user) => {
        if (!user) {
          console.log('Not authenticated, redirecting to login on client.');
          this.router.navigate(['login']);
          return false;
        }
        return true;
      })
    );
  }
}
