/// <reference types="vite/client" />
import {
  enableProdMode,
  importProvidersFrom,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';

import { provideHttpClient, withXhr } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as Sentry from '@sentry/angular';
import {
  AppRoutingModule,
  HomeModule,
} from '@course-platform/course-client/feature';
import {
  CoreModule,
  CourseClientDomainModule,
  ProfileSBService,
  ProfileService,
  environment,
} from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import {
  CourseResourcesTrpcService,
  CourseResourcesService,
  ENDPOINTS_TOKEN,
  Endpoints,
} from '@course-platform/shared/domain';
import { provideTrpcClient } from '@course-platform/shared/domain/trpc-client';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from './app/app.component';
import {
  AuthSBService,
  AuthService,
} from '@course-platform/shared/auth/domain';

export function preloadFeagureFlags(
  featureToggleService: FeatureToggleService,
) {
  return () => featureToggleService.getFeatureFlags().toPromise();
}

export function endpointsFactory() {
  return {
    courseServiceUrl: environment.courseServiceUrl,
  } as Endpoints;
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
        provideAppInitializer(() => {
          const initializerFn = preloadFeagureFlags(
            inject(FeatureToggleService),
          );
          return initializerFn();
        }),
        {
          provide: ENDPOINTS_TOKEN,
          useFactory: endpointsFactory,
        },
        provideHttpClient(withXhr()),
        provideTrpcClient(),
        provideTranslateService({
          loader: provideTranslateHttpLoader({
            prefix: '/assets/i18n/',
            suffix: '.json',
          }),
        }),
        {
          provide: ProfileService,
          useClass: ProfileSBService,
        },
        importProvidersFrom([
          BrowserAnimationsModule,
          AppRoutingModule,
          CoreModule,
          SharedModule,
          HomeModule,
          CourseClientDomainModule,
        ]),
        {
          provide: CourseResourcesService,
          useClass: CourseResourcesTrpcService,
        },
        {
          provide: AuthService,
          useClass: AuthSBService,
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
