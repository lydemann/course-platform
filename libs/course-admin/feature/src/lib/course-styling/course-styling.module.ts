import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { CourseStylingRoutingModule } from './course-styling-routing.module';
import { CourseStylingComponent } from './course-styling.component';

@NgModule({
  declarations: [CourseStylingComponent],
  imports: [CommonModule, CourseStylingRoutingModule, SharedModule],
})
export class CourseStylingModule {}
