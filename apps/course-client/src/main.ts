/// <reference types="vite/client" />
import {
  APP_INITIALIZER,
  ErrorHandler,
  enableProdMode,
  importProvidersFrom,
  isDevMode,
} from '@angular/core';

import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Sentry from '@sentry/angular-ivy';
import {
  AppRoutingModule,
  HomeModule,
} from '@course-platform/course-client/feature';
import {
  CoreModule,
  CourseClientDomainModule,
  ProfileFBService,
  ProfileService,
  environment,
} from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import {
  CourseResourcesFbService,
  CourseResourcesService,
  ENDPOINTS_TOKEN,
  Endpoints,
  FirebaseModule,
  GraphQLModule,
} from '@course-platform/shared/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Router } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import {
  AuthFBService,
  AuthService,
  authFBInterceptor,
} from '@course-platform/shared/auth/domain';

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
  return new TranslateHttpLoader(http, `/assets/i18n/`, '.json');
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any;
  }
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

if (environment.production) {
  enableProdMode();
}

// load app config
const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'assets/app-config.json', true);
xhttp.onreadystatechange = function () {
  if (this.readyState === 4 && this.status === 200) {
    const config = JSON.parse(this.responseText);
    window.config = config;

    if (environment.production) {
      enableProdMode();
    }

    bootstrapApplication(AppComponent, {
      providers: [
        {
          provide: APP_INITIALIZER,
          multi: true,
          useFactory: preloadFeagureFlags,
          deps: [FeatureToggleService],
        },
        {
          provide: ENDPOINTS_TOKEN,
          useFactory: endpointsFactory,
        },
        provideHttpClient(withInterceptors([authFBInterceptor])),
        {
          provide: ProfileService,
          useClass: ProfileFBService,
        },
        importProvidersFrom([
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: httpLoaderFactory,
              deps: [HttpClient],
            },
          }),
          BrowserAnimationsModule,
          AppRoutingModule,
          CoreModule,
          SharedModule,
          HomeModule,
          CourseClientDomainModule,
          FirebaseModule,
          GraphQLModule,
        ]),
        // TODO: move to firebase module
        {
          provide: CourseResourcesService,
          useClass: CourseResourcesFbService,
        },
        {
          provide: AuthService,
          useClass: AuthFBService,
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
        //   }),
        // },
        provideServiceWorker('ngsw-worker.js', {
          enabled: !isDevMode(),
          registrationStrategy: 'registerWhenStable:30000',
        }),
      ],
    }).catch((err) => console.error(err));
  }
};
xhttp.send();
