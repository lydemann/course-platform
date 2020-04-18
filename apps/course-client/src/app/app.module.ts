import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeatureToggleService } from '@course-platform/shared/util/util-feature-toggle';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HomeModule } from './home/home.module';

export function preloadFeagureFlags(
  featureToggleService: FeatureToggleService
) {
  return () => {
    return featureToggleService.getFeatureFlags().toPromise();
  };
}
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, HomeModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: preloadFeagureFlags,
      deps: [FeatureToggleService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
