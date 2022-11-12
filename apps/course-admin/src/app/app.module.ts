import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {
  Endpoints,
  ENDPOINTS_TOKEN,
} from '@course-platform/shared/data-access';
import { SharedFeatAuthModule } from '@course-platform/shared/feat-auth';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { TopbarModule } from './layout/topbar/topbar.module';

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
    HttpClientModule,
    CoreModule,
    LayoutModule,
    TopbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedFeatAuthModule,
  ],
  providers: [
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
