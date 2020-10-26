import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CreateLessonModalModule } from './components/create-section-modal/create-lesson-modal/create-lesson-modal.module';
import { CourseAdminComponent } from './course-admin.component';
import { CourseAdminRoutingModule } from './course-admin.routing';

@NgModule({
  imports: [SharedModule, CourseAdminRoutingModule, CreateLessonModalModule],
  declarations: [CourseAdminComponent]
})
export class CourseAdminModule {}
