import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

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
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    provideFirebaseApp(() => {
      return initializeApp(config);
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      return firestore;
    }),
    provideAuth(() => {
      const auth = getAuth();
      return auth;
    }),
  ],
})
export class FirebaseModule {}
