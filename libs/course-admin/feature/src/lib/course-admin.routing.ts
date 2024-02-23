import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@course-platform/shared/auth/domain';
import { CourseAdminComponent } from './course-admin.component';
import { CourseAdminResolver } from './course-admin.resolver';

const routes: Routes = [
  {
    path: ':courseId',
    canActivate: [AuthGuard],
    resolve: [CourseAdminResolver],
    children: [
      {
        path: '',
        component: CourseAdminComponent,
      },
      {
        path: 'lesson-admin',
        loadChildren: () =>
          import('./lesson-admin/lesson-admin.module').then(
            (m) => m.LessonAdminModule
          ),
      },
      {
        path: 'section-admin',
        loadChildren: () =>
          import('./section-admin/section-admin.module').then(
            (m) => m.SectionAdminModule
          ),
      },
      {
        path: 'styling',
        loadChildren: () =>
          import('./course-styling/course-styling.module').then(
            (m) => m.CourseStylingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseAdminRoutingModule {}
