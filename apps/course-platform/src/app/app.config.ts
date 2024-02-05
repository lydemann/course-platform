import { provideFileRouter } from '@analogjs/router';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  CoreModule,
  CourseClientDomainModule,
  environment,
} from '@course-platform/course-client/shared/domain';
import {
  SharedAuthDomainModule,
  authServerInterceptor,
} from '@course-platform/shared/auth-domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
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
  return new TranslateHttpLoader(
    http,
    `http://localhost:4200/assets/i18n/`,
    '.json'
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    // makes sure the client is hydrated with the server state to avoid redundant client requests
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([cookieInterceptor, authServerInterceptor])
    ),
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
    importProvidersFrom([
      CoreModule,
      CourseClientDomainModule,
      SharedAuthDomainModule,
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: httpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ]),
  ],
};
