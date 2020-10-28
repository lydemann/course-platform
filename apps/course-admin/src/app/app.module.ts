import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  Endpoints,
  ENDPOINTS_TOKEN
} from '@course-platform/shared/data-access';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';

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
    HttpClientModule,
    CoreModule
  ],
  providers: [
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: EndpointsFactory
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
