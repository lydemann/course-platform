import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RedirectIfAuthenticatedResolver } from './core/auth/redirect-if-authenticated.service';
import { RedirectIfLoggedOutResolver } from './core/auth/redirect-if-logged-out.service';
import { HomeComponent } from './home/home.component';
import { RedirectToCourseResolver } from './redirect-to-course.resolver';
import { SchoolIdResolver } from './school-id.resolver';

const routes: Routes = [
  {
    path: ':schoolId',
    resolve: [SchoolIdResolver],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'courses'
      },
      {
        path: 'courses',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./courses/courses.module').then(m => m.CoursesModule),
            resolve: [RedirectIfLoggedOutResolver]
          },
          {
            path: ':courseId',
            resolve: [RedirectIfLoggedOutResolver],
            loadChildren: () =>
              import('./course/course.module').then(m => m.CourseModule)
          }
        ]
      },
      {
        path: 'help',
        resolve: [RedirectIfLoggedOutResolver],
        loadChildren: () => import('./help/help.module').then(m => m.HelpModule)
      },
      {
        path: 'profile',
        resolve: [RedirectIfLoggedOutResolver],
        loadChildren: () =>
          import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then(m => m.HelpModule)
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then(m => m.LoginModule)
      }
    ]
  },
  // {
  //   path: '',
  //   component: HomeComponent,
  //   resolve: [RedirectIfAuthenticatedResolver, RedirectIfLoggedOutResolver]
  // },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `christianlydemann-eyy6e/courses`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
