import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CourseClientLibModule } from '@course-platform/course-client-lib';
import {
  Endpoints,
  ENDPOINTS_TOKEN
} from '@course-platform/shared/data-access';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';

export function preloadFeagureFlags(
  featureToggleService: FeatureToggleService
) {
  return () => {
    return featureToggleService.getFeatureFlags().toPromise();
  };
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, `/assets/i18n/`, '.json');
}

export function EndpointsFactory() {
  return {
    courseServiceUrl: window.config.courseServiceUrl
  } as Endpoints;
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    CoreModule,
    SharedModule,
    HomeModule,
    CourseClientLibModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: preloadFeagureFlags,
      deps: [FeatureToggleService]
    },
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: EndpointsFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
