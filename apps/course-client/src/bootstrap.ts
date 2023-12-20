import {
  APP_INITIALIZER,
  enableProdMode,
  importProvidersFrom,
} from '@angular/core';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CourseClientLibModule,
  environment,
} from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import { SharedAuthDomainModule } from '@course-platform/shared/auth-domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app.routing';
import { CoreModule } from './app/core/core.module';
import { HomeModule } from './app/home/home.module';

export function preloadFeagureFlags(
  featureToggleService: FeatureToggleService
) {
  return () => featureToggleService.getFeatureFlags().toPromise();
}

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `/assets/i18n/`, '.json');
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
          BrowserAnimationsModule,
          AppRoutingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: httpLoaderFactory,
              deps: [HttpClient],
            },
          }),
          HttpClientModule,
          CoreModule,
          SharedModule,
          HomeModule,
          CourseClientLibModule,
          SharedAuthDomainModule,
        ]),
      ],
    }).catch((err) => console.error(err));
  }
};
xhttp.send();
