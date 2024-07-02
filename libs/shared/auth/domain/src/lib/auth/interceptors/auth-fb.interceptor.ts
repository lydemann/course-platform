import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { exhaustMap, first, switchMap, take } from 'rxjs/operators';

import { Auth } from '@angular/fire/auth';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AuthFBService } from '../services/auth-fb.service';

@Injectable({ providedIn: 'root' })
export class AuthFBInterceptor implements HttpInterceptor {
  constructor(private authService: AuthFBService, private auth: Auth) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.auth.tenantId) {
      return next.handle(req);
    }

    return from(this.authService.getFBUser()).pipe(
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

export const authInterceptor: HttpInterceptorFn = (
  req,
  next,
  platformId = inject(PLATFORM_ID)
) => {
  if (isPlatformServer(platformId)) {
    return next(req);
  }

  const userService = inject(AuthFBService);
  const auth = inject(Auth);

  if (!auth.tenantId) {
    return next(req);
  }

  return from(userService.getFBUser()).pipe(
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
