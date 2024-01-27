import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  AppRoutingModule,
  HomeModule,
} from '@course-platform/course-client/feature';
import {
  CoreModule,
  CourseClientDomainModule,
  environment,
} from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import { SharedAuthDomainModule } from '@course-platform/shared/auth-domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';

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
          HttpClientModule,
          CoreModule,
          SharedModule,
          HomeModule,
          CourseClientDomainModule,
          SharedAuthDomainModule,
        ]),
      ],
    }).catch((err) => console.error(err));
  }
};
xhttp.send();
