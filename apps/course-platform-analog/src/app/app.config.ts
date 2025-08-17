import { provideFileRouter, withExtraRoutes } from '@analogjs/router';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  Routes,
  withComponentInputBinding,
  withNavigationErrorHandler,
} from '@angular/router';
import {
  CoreModule,
  CourseClientDomainModule,
  ProfileSBService,
  ProfileService,
  environment,
} from '@course-platform/course-client/shared/domain';
import {
  AuthSBService,
  AuthService,
} from '@course-platform/shared/auth/domain';
import {
  CourseResourcesService,
  CourseResourcesTrpcService,
  ENDPOINTS_TOKEN,
  Endpoints,
} from '@course-platform/shared/domain';
import { provideTrpcClient } from '@course-platform/shared/domain/trpc-client';
import { NgrxUniversalRehydrateBrowserModule } from '@course-platform/shared/ngrx-universal-rehydrate';
import { cookieInterceptor } from '@course-platform/shared/ssr/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function preloadFeagureFlags(
  featureToggleService: FeatureToggleService
) {
  return () => featureToggleService.getFeatureFlags();
}

export function endpointsFactory() {
  return {
    courseServiceUrl: environment.courseServiceUrl,
  } as Endpoints;
}

export function httpLoaderFactory(http: HttpClient) {
  const host =
    import.meta.env['VITE_ANALOG_PUBLIC_BASE_URL'] || 'http://localhost:4200';
  return new TranslateHttpLoader(http, `${host}/assets/i18n/`, '.json');
}

const customRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@course-platform/course-admin/shell').then(
        (m) => m.RemoteEntryModule
      ),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(
      withExtraRoutes(customRoutes),
      withComponentInputBinding(),
      withNavigationErrorHandler(console.error)
    ),
    // makes sure the client is hydrated with the server state to avoid redundant client requests
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true,
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch(), withInterceptors([cookieInterceptor])),
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
    {
      provide: CourseResourcesService,
      useClass: CourseResourcesTrpcService,
    },
    {
      provide: AuthService,
      useClass: AuthSBService,
    },
    {
      provide: ProfileService,
      useClass: ProfileSBService,
    },
    provideTrpcClient(),
    importProvidersFrom([
      BrowserModule,
      BrowserAnimationsModule,
      CoreModule,
      CourseClientDomainModule,
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
