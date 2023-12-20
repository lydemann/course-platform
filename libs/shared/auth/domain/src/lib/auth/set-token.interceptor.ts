import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { exhaustMap, first, switchMap } from 'rxjs/operators';

import { Auth } from '@angular/fire/auth';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class SetTokenInterceptor implements HttpInterceptor {
  constructor(private userService: UserService, private auth: Auth) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!this.userService.currentUser$.value || !this.auth.tenantId) {
      return next.handle(req);
    }

    return this.userService.currentUser$.pipe(
      first(),
      switchMap((user) => from(user?.getIdToken() || '')),
      exhaustMap((token) => {
        const tenantId = this.auth.tenantId;
        let headers = tenantId
          ? req.headers.append('Schoolid', tenantId)
          : req.headers;

        headers = headers.append('Authorization', token);
        const authReq = req.clone({ headers });
        return next.handle(authReq);
      })
    );
  }
}
