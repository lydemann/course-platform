import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CommonModule } from '@angular/common';
import { environment } from '@course-platform/course-admin/shared/domain';
import { authInterceptor } from '@course-platform/shared/auth/domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
import { AppRoutingModule } from './app.routing';
import { LayoutModule } from './layout/layout.module';
import { TopbarModule } from './layout/topbar/topbar.module';

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `/assets/i18n/`, '.json');
}

export function endpointsFactory() {
  return {
    courseServiceUrl: environment.courseServiceUrl,
  } as Endpoints;
}

@NgModule({
  exports: [
    CommonModule,
    AppRoutingModule,
    LayoutModule,
    TopbarModule,
    TranslateModule,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    LayoutModule,
    TopbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class RemoteEntryModule {}
