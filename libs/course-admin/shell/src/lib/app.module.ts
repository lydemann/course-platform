import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CourseAdminSharedDomainModule } from "@course-platform/course-admin/shared/domain";

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { RemoteEntryModule } from './entry.module';

const config = {
  apiKey: 'AIzaSyAllXCbFgJ3j7POph8iikTkBNOgmjc1vj4',
  authDomain: 'aaa-course-portal.firebaseapp.com',
  databaseURL: 'https://aaa-course-portal.firebaseio.com',
  projectId: 'aaa-course-portal',
  storageBucket: 'aaa-course-portal.appspot.com',
  messagingSenderId: '274665468824',
  appId: '1:274665468824:web:0d3a55a3aca4ce4fc9b1ed',
  measurementId: 'G-4D02VHTXTV',
};


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => {
      debugger
      return initializeApp(config);
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      return firestore;
    }),
    provideAuth(() => {
      debugger
      const auth = getAuth();
      return auth;
    }),
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
