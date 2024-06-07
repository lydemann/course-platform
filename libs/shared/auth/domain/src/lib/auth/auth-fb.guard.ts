import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFBGuard {
  constructor(public userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
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
