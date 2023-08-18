import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CourseStylingComponent } from './course-styling.component';

const routes: Routes = [
  {
    path: '',
    component: CourseStylingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseStylingRoutingModule {}
