import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { SetTokenInterceptor } from './auth/set-token.interceptor';

@NgModule({
  imports: [CommonModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SetTokenInterceptor, multi: true }
  ]
})
export class SharedFeatAuthModule {}
