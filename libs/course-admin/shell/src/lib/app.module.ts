import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CourseAdminSharedDomainModule } from "@course-platform/course-admin/shared/domain";

import { AppComponent } from './app.component';
import { RemoteEntryModule } from './entry.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CourseAdminSharedDomainModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () =>
            import('./entry.module').then((m) => m.RemoteEntryModule),
        },
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
    RemoteEntryModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
