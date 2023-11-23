import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { UserService } from '@course-platform/shared/auth-domain';

@Injectable({ providedIn: 'root' })
export class RedirectIfAuthenticatedResolver implements Resolve<boolean> {
  constructor(
    public afAuth: Auth,
    public userService: UserService,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
      first(),
      map((currentUser) => {
        if (currentUser) {
          this.router.navigate(['courses']);
        }
        return true;
      })
    );
  }
}
