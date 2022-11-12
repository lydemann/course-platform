import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(public userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
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
