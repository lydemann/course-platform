import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CourseModalComponent } from './course-modal/course-modal/course-modal.component';
import { DeleteCourseModalComponent } from './course-modal/delete-course-modal/delete-course-modal.component';
import { CoursesComponent } from './courses.component';
import { CoursesRoutingModule } from './courses.routing';
import { SharedModule } from '@course-platform/course-admin/shared/ui';

@NgModule({
  imports: [CommonModule, SharedModule, CoursesRoutingModule],
  declarations: [
    CoursesComponent,
    CourseModalComponent,
    DeleteCourseModalComponent,
  ],
})
export class CoursesModule {}
