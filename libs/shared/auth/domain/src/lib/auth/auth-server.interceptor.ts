import { isPlatformServer } from '@angular/common';
import {
  HttpHandlerFn,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { from } from 'rxjs';
import { UserServerService } from './user-server.service';

export const authServerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  location = inject(PLATFORM_ID),
  cookieService = inject(SsrCookieService),
  userServerService = inject(UserServerService)
) => {
  return from(
    handleAuthServerInterceptor(
      req,
      next,
      location,
      cookieService,
      userServerService
    )
  );
};

async function handleAuthServerInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  location,
  cookieService,
  userServerService
) {
  if (isPlatformServer(location)) {
    let headers = new HttpHeaders();

    const token = cookieService.get('token');
    headers = headers.set('Authorization', token);

    const userInfo = await userServerService.getUserInfo();
    const tenantId = userInfo.firebase.tenant;
    headers = headers.set('Schoolid', tenantId);

    const cookiedRequest = req.clone({
      headers,
    });

    return next(cookiedRequest).toPromise();
  } else {
    return next(req).toPromise();
  }
}
