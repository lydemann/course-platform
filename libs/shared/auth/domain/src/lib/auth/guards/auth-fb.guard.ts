import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';
import { AuthFBService } from '../services/auth-fb.service';

@Injectable({
  providedIn: 'root',
})
export class AuthFBGuard {
  constructor(public authFBService: AuthFBService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return from(this.authFBService.getFBUser()).pipe(
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
