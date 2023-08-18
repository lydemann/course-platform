import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RedirectIfAuthenticatedResolver } from '@course-platform/course-admin/shared/domain';
import { SchoolIdResolver } from '@course-platform/shared/domain';
import { AuthGuard } from '@course-platform/shared/feat-auth';
import { LayoutComponent } from './layout/layout.component';

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
        resolve: [RedirectIfAuthenticatedResolver],
        loadChildren: () =>
          import('@course-platform/course-admin/login/feature').then((m) => m.LoginModule),
      },
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: '',
            canActivate: [AuthGuard],
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
            loadChildren: () =>
              import('@course-platform/course-admin/create-user/feature').then(
                (m) => m.CreateUserModule
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
