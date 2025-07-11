import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  authSBGuard,
  RedirectIfLoggedInResolver,
} from '@course-platform/shared/auth/domain';
import { LayoutComponent } from './layout/layout.component';

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
    children: [
      {
        path: 'login',
        resolve: [RedirectIfLoggedInResolver],
        loadComponent: () =>
          import('@course-platform/course-admin/login/feature').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: '',
            canActivate: [authSBGuard],
            children: [
              {
                path: 'courses',
                loadChildren: () =>
                  import('@course-platform/course-admin/feature').then(
                    (m) => m.CoursesModule
                  ),
              },
              {
                path: 'course-admin',
                loadChildren: () =>
                  import('@course-platform/course-admin/feature').then(
                    (m) => m.CourseAdminModule
                  ),
              },
              {
                path: 'settings',
                loadChildren: () =>
                  import('@course-platform/course-admin/settings/feature').then(
                    (m) => m.SettingsModule
                  ),
              },
            ],
          },
          {
            path: 'create-user',
            loadComponent: () =>
              import('@course-platform/course-admin/create-user/feature').then(
                (m) => m.CreateUserComponent
              ),
          },
        ],
      },
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
