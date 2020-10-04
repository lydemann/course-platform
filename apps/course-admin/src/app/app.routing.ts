import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
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
    path: 'lesson-admin',
    loadChildren: () =>
      import('./lesson-admin/lesson-admin.module').then(
        m => m.LessonAdminModule
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
