import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolIdResolver } from '@course-platform/shared/data-access';

import { RedirectIfLoggedOutResolver } from './core/auth/redirect-if-logged-out.service';
import { CourseResolver } from './course/resolvers/course.resolver';
import { RedirectToCourseResolver } from './redirect-to-course.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: [SchoolIdResolver],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'courses',
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('./forgot-password/forgot-password.module').then(
            (m) => m.ForgotPasswordModule
          ),
      },
      {
        path: '',
        resolve: [RedirectIfLoggedOutResolver],
        children: [
          {
            path: 'courses',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('./courses/courses.module').then(
                    (m) => m.CoursesModule
                  ),
              },
              {
                path: ':courseId',
                resolve: [CourseResolver],
                loadChildren: () =>
                  import('./course/course.module').then((m) => m.CourseModule),
              },
            ],
          },
          {
            path: 'help',
            loadChildren: () =>
              import('./help/help.module').then((m) => m.HelpModule),
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('./profile/profile.module').then((m) => m.ProfileModule),
          },
          {
            path: 'help',
            loadChildren: () =>
              import('./help/help.module').then((m) => m.HelpModule),
          },
        ],
      },
    ],
  },
  // {
  //   path: '',
  //   component: HomeComponent,
  //   resolve: [RedirectIfAuthenticatedResolver, RedirectIfLoggedOutResolver]
  // },
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: `christianlydemann-eyy6e/courses`
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
