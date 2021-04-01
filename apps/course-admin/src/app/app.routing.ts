import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchoolIdResolver } from '@course-platform/shared/data-access';
import { AuthGuard } from '@course-platform/shared/feat-auth';
import { RedirectIfAuthenticatedResolver } from './core/auth/redirect-if-authenticated.service';
import { LayoutComponent } from './layout/layout.component';

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
        resolve: [RedirectIfAuthenticatedResolver],
        loadChildren: () =>
          import('./login/login.module').then((m) => m.LoginModule),
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
                  import('./courses/courses.module').then(
                    (m) => m.CoursesModule
                  ),
              },
              {
                path: 'course-admin',
                loadChildren: () =>
                  import('./course-admin/course-admin.module').then(
                    (m) => m.CourseAdminModule
                  ),
              },
              {
                path: 'settings',
                loadChildren: () =>
                  import('./settings/settings.module').then(
                    (m) => m.SettingsModule
                  ),
              },
            ],
          },
          {
            path: 'create-user',
            loadChildren: () =>
              import('./create-user/create-user.module').then(
                (m) => m.CreateUserModule
              ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: ``,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
