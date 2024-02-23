import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SharedUiModule } from '@course-platform/shared/ui';
import { CourseModalComponent } from './course-modal/course-modal/course-modal.component';
import { DeleteCourseModalComponent } from './course-modal/delete-course-modal/delete-course-modal.component';
import { CoursesComponent } from './courses.component';
import { CoursesRoutingModule } from './courses.routing';

@NgModule({
  imports: [CommonModule, SharedModule, CoursesRoutingModule, SharedUiModule],
  declarations: [
    CoursesComponent,
    CourseModalComponent,
    DeleteCourseModalComponent,
  ],
})
export class CoursesModule {}
