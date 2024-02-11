import { provideFileRouter } from '@analogjs/router';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CoreModule,
  CourseClientDomainModule,
  environment,
} from '@course-platform/course-client/shared/domain';
import {
  SharedAuthDomainModule,
  authInterceptor,
  authServerInterceptor,
} from '@course-platform/shared/auth/domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
import { NgrxUniversalRehydrateBrowserModule } from '@course-platform/shared/ngrx-universal-rehydrate';
import { cookieInterceptor } from '@course-platform/shared/ssr/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function preloadFeagureFlags(
  featureToggleService: FeatureToggleService
) {
  return () => featureToggleService.getFeatureFlags().toPromise();
}

export function endpointsFactory() {
  return {
    courseServiceUrl: environment.courseServiceUrl,
  } as Endpoints;
}

export function httpLoaderFactory(http: HttpClient) {
  const isProd = process.env['NODE_ENV'] === 'production';
  const host = isProd
    ? 'https://course-platform-analog.web.app'
    : process.env['VITE_ANALOG_PUBLIC_BASE_URL'];
  if (host) {
    return new TranslateHttpLoader(http, `${host}/assets/i18n/`, '.json');
  }
  return new TranslateHttpLoader(http, `/assets/i18n/`, '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    // makes sure the client is hydrated with the server state to avoid redundant client requests
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        cookieInterceptor,
        authServerInterceptor,
        authInterceptor,
      ])
    ),
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
    importProvidersFrom([
      BrowserModule,
      BrowserAnimationsModule,
      CoreModule,
      CourseClientDomainModule,
      SharedAuthDomainModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
      NgrxUniversalRehydrateBrowserModule.forRoot({}),
    ]),
  ],
};
