import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { CoursesComponent } from './courses.component';
import { CoursesRoutingModule } from './courses.routing';

@NgModule({
  imports: [CommonModule, SharedModule, CoursesRoutingModule],
  declarations: [CoursesComponent],
})
export class CoursesModule {}
