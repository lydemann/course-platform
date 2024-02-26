import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolIdResolver } from '@course-platform/shared/domain';

import {
  RedirectIfLoggedInResolver,
  RedirectIfLoggedOutResolver,
} from '@course-platform/course-client/shared/domain';
import { courseRoutes } from './course/course.routing';
import { CourseResolver } from './course/resolvers/course.resolver';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'courses',
  },
  {
    path: '',
    resolve: [SchoolIdResolver],
    children: [
      {
        path: 'login',
        resolve: [RedirectIfLoggedInResolver],
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent),
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
                loadComponent: () =>
                  import('./courses/courses.component').then(
                    (m) => m.CoursesComponent
                  ),
              },
              {
                path: ':courseId',
                resolve: [CourseResolver],
                children: courseRoutes,
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
  {
    path: 'admin',
    loadChildren: () =>
      import('@course-platform/course-admin/shell').then(
        (m) => m.RemoteEntryModule
      ),
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
