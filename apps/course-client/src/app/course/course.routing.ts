import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@course-platform/shared/feat-auth';
import { CourseComponent } from './course.component';
import { CourseResolver } from './resolvers/course.resolver';

const routes: Routes = [
  {
    path: ':selectedSectionId/:selectedLessonId',
    component: CourseComponent,
    canActivate: [AuthGuard],
    resolve: [CourseResolver]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureRoutingModule {}
