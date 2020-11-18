import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { exhaustMap, switchMap } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class SetTokenInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.userService.currentUser$.value) {
      return next.handle(req);
    }

    return this.userService.currentUser$.pipe(
      switchMap(user => {
        return from(user.getIdToken());
      }),
      exhaustMap(token => {
        const tenantId = this.userService.currentUser$.value.tenantId;
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
