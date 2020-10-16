import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@course-platform/shared/feat-auth';
import { RedirectIfAuthenticatedResolver } from './core/auth/redirect-if-authenticated.service';

const routes: Routes = [
  {
    path: '',
    resolve: [RedirectIfAuthenticatedResolver],
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'course-admin',
    loadChildren: () =>
      import('./course-admin/course-admin.module').then(
        m => m.CourseAdminModule
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
