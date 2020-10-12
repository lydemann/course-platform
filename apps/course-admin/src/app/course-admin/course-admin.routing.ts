import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@course-platform/shared/feat-auth';
import { CourseAdminComponent } from './course-admin.component';
import { CourseAdminResolver } from './course-admin.resolver';

const routes: Routes = [
  {
    path: '',
    component: CourseAdminComponent,
    resolve: [CourseAdminResolver],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseAdminRoutingModule {}
