import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
      first(),
      map(currentUser => {
        if (!currentUser) {
          this.router.navigate([auth().tenantId, 'login']);
        }
        return !!currentUser;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
