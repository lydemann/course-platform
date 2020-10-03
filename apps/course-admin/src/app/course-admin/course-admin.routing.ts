import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseAdminComponent } from './course-admin.component';
import { CourseAdminResolver } from './course-admin.resolver';

const routes: Routes = [
  { path: '', component: CourseAdminComponent, resolve: [CourseAdminResolver] }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseAdminRoutingModule {}
