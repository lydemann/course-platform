import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth/auth.guard';
import { CourseComponent } from './course.component';
import { CourseResolver } from './resolvers/course.resolver';

const routes: Routes = [
  {
    path: ':selectedSectionId',
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
