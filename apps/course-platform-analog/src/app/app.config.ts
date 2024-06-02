import { provideFileRouter } from '@analogjs/router';
import {
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Sentry from '@sentry/angular-ivy';
import {
  CoreModule,
  CourseClientDomainModule,
  environment,
} from '@course-platform/course-client/shared/domain';
import {
  authInterceptor,
  authServerInterceptor,
} from '@course-platform/shared/auth/domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
import { NgrxUniversalRehydrateBrowserModule } from '@course-platform/shared/ngrx-universal-rehydrate';
import { cookieInterceptor } from '@course-platform/shared/ssr/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Router } from '@angular/router';

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

Sentry.init({
  dsn: 'https://b1eed35b84c2dab0896baa461082a81b@o4507049117548544.ingest.us.sentry.io/4507049118859264',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/app.christianlydemann\.com/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
    // {
    //   provide: Sentry.TraceService,
    //   deps: [Router],
    // },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: () => () => {},
    //   deps: [Sentry.TraceService],
    //   multi: true,
    // },
    // {
    //   provide: ErrorHandler,
    //   useValue: Sentry.createErrorHandler({
    //     showDialog: environment.production,
    //     logErrors: true,
    //   }),
    // },
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
