// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAllXCbFgJ3j7POph8iikTkBNOgmjc1vj4',
    authDomain: 'aaa-course-portal.firebaseapp.com',
    databaseURL: 'https://aaa-course-portal.firebaseio.com',
    projectId: 'aaa-course-portal',
    storageBucket: 'aaa-course-portal.appspot.com',
    messagingSenderId: '274665468824',
    appId: '1:274665468824:web:0d3a55a3aca4ce4fc9b1ed',
    measurementId: 'G-4D02VHTXTV'
  },
  courseServiceUrl: 'http://localhost:5000/aaa-course-portal/us-central1/api'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
