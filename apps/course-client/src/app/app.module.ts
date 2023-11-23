import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { environment } from '@course-platform/course-client-env';
import { CourseClientLibModule } from '@course-platform/course-client-lib';
import { SharedAuthDomainModule } from '@course-platform/shared/auth-domain';
import { ENDPOINTS_TOKEN, Endpoints } from '@course-platform/shared/domain';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';

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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
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
    LayoutModule,
    CourseClientLibModule,
    SharedAuthDomainModule,
  ],
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
