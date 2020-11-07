import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RedirectIfAuthenticatedResolver } from './core/auth/redirect-if-authenticated.service copy';
import { RedirectIfLoggedOutResolver } from './core/auth/redirect-if-logged-out.service';
import { HomeComponent } from './home/home.component';
import { RedirectToCourseResolver } from './redirect-to-course.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: [RedirectIfAuthenticatedResolver, RedirectIfLoggedOutResolver]
  },
  {
    path: 'course',
    resolve: [RedirectToCourseResolver, RedirectIfLoggedOutResolver],
    loadChildren: () =>
      import('./course/course.module').then(m => m.CourseModule)
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
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
