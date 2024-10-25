import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolIdResolver } from '@course-platform/shared/domain';

import { courseRoutes } from './course/course.routing';
import { CourseResolver } from './course/resolvers/course.resolver';
import {
  RedirectIfLoggedInResolver,
  RedirectIfLoggedOutResolver,
} from '@course-platform/shared/auth/domain';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'courses',
  },
  {
    path: 'logout',
    loadComponent: () =>
      import('@course-platform/shared/auth/feature').then(
        (m) => m.LogoutComponent
      ),
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
        loadComponent: () =>
          import('./forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
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
            loadComponent: () =>
              import('./profile/profile.component').then(
                (m) => m.ProfileComponent
              ),
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
