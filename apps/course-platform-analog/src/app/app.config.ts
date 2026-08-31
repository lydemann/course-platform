import { provideFileRouter, withExtraRoutes } from '@analogjs/router';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
  withNoIncrementalHydration,
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
import { provideCopilotKit } from '@copilotkit/angular';
import { NgrxUniversalRehydrateBrowserModule } from '@course-platform/shared/ngrx-universal-rehydrate';
import { cookieInterceptor } from '@course-platform/shared/ssr/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { APP_BASE_HREF } from '@angular/common';

export function preloadFeagureFlags(
  featureToggleService: FeatureToggleService,
) {
  return () => featureToggleService.getFeatureFlags();
}

export function endpointsFactory() {
  return {
    courseServiceUrl: environment.courseServiceUrl,
  } as Endpoints;
}

const customRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('@course-platform/course-admin/shell').then(
        (m) => m.RemoteEntryModule,
      ),
  },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(
      withExtraRoutes(customRoutes),
      withComponentInputBinding(),
      withNavigationErrorHandler(console.error),
    ),
    [
      {
        provide: APP_BASE_HREF,
        useValue: '/',
      },
    ],
    // makes sure the client is hydrated with the server state to avoid redundant client requests
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
        includeRequestsWithAuthHeaders: true,
      }),
      withNoIncrementalHydration(),
    ),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([cookieInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
    }),
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
    // Same-origin: Analog serves `src/server/routes` under `/api`, so this hits
    // the Nitro handler in `src/server/routes/copilotkit/[...].ts`.
    // The Authorization header is attached per-session in `AppComponent`.
    provideCopilotKit({
      runtimeUrl: '/api/copilotkit',
      // The dev inspector is left to CopilotKit's own isDevMode() gate, which
      // is false in an optimized build (ngDevMode is compiled out). Verified
      // against the production bundle; re-check if that build config changes.
      // Publishable CopilotKit Cloud key; pairs with COPILOTKIT_API_KEY on the
      // server. Safe in the browser bundle by design.
      licenseKey: import.meta.env['VITE_COPILOTKIT_PUBLIC_KEY'],
    }),
    importProvidersFrom([
      BrowserModule,
      BrowserAnimationsModule,
      CoreModule,
      CourseClientDomainModule,
      NgrxUniversalRehydrateBrowserModule.forRoot({}),
    ]),
  ],
};
