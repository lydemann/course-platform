import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import {
  exhaust,
  exhaustMap,
  filter,
  map,
  mergeMap,
  switchMap
} from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable()
export class SetTokenInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.userService.currentUser$.pipe(
      filter(user => !!user),
      switchMap(user => {
        return from(user.getIdToken());
      }),
      exhaustMap(token => {
        const headers = req.headers.set('authorization', token);
        const authReq = req.clone({ headers });
        return next.handle(authReq);
      })
    );
  }
}
