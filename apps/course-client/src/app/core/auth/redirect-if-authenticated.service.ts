import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { UserService } from '@course-platform/shared/feat-auth';

@Injectable({ providedIn: 'root' })
export class RedirectIfAuthenticatedResolver implements Resolve<boolean> {
  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
      first(),
      map(currentUser => {
        if (!!currentUser) {
          this.router.navigate(['course']);
        }
        return true;
      })
    );
  }
}
