import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideFileRouter } from '@analogjs/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CoreModule,
  CourseClientDomainModule,
  environment,
} from '@course-platform/course-client/shared/domain';
import { NgrxUniversalRehydrateBrowserModule } from '@course-platform/shared/ngrx-universal-rehydrate';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
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
