import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { exhaustMap, first, switchMap } from 'rxjs/operators';

import { Auth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private auth: Auth) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.userService.currentUser() || !this.auth.tenantId) {
      return next.handle(req);
    }

    return this.userService.currentUser$.pipe(
      first(),
      switchMap((user) => from(user?.getIdToken() || '')),
      exhaustMap((token) => {
        const tenantId = this.auth.tenantId;
        let headers = tenantId
          ? req.headers.set('Schoolid', tenantId)
          : req.headers;

        headers = headers.set('Authorization', token);
        const authReq = req.clone({ headers });
        return next.handle(authReq);
      })
    );
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const auth = inject(Auth);
  if (!userService.currentUser() || !auth.tenantId) {
    return next(req);
  }

  return userService.currentUser$.pipe(
    first(),
    switchMap((user) => from(user?.getIdToken() || '')),
    exhaustMap((token) => {
      const tenantId = auth.tenantId;
      let headers = tenantId
        ? req.headers.set('Schoolid', tenantId)
        : req.headers;

      headers = headers.set('Authorization', token);
      const authReq = req.clone({ headers });
      return next(authReq);
    })
  );
};
