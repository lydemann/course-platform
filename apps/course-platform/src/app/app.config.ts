import { provideFileRouter } from '@analogjs/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  CoreModule,
  CourseClientLibModule,
  environment,
} from '@course-platform/course-client/shared/domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
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
    `http:localhost:4200/assets/i18n/`,
    '.json'
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    // TODO: add feature flags
    // {
    //   provide: APP_INITIALIZER,
    //   multi: true,
    //   useFactory: preloadFeagureFlags,
    //   deps: [FeatureToggleService],
    // },
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
    importProvidersFrom([
      CoreModule,
      CourseClientLibModule,
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
