import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@course-platform/shared/auth/domain';
import { LessonAdminComponent } from './lesson-admin.component';
import { LessonAdminResolver } from './lesson-admin.resolver';

const routes: Routes = [
  {
    path: ':sectionId/:lessonId',
    component: LessonAdminComponent,
    resolve: [LessonAdminResolver],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonAdminRoutingModule {}
