import { provideFileRouter, withExtraRoutes } from '@analogjs/router';
import {
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
    provideZoneChangeDetection({ eventCoalescing: true }),
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
      // CopilotKit mounts a floating dev inspector by default. It is gated on
      // Angular's isDevMode() so it should not render in a production build,
      // but this is student-facing, so turn it off explicitly rather than rely
      // on that.
      enableInspector: false,
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
