import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CreateLessonModalModule } from './components/create-lesson-modal/create-lesson-modal.module';
import { CreateSectionModalModule } from './components/create-section-modal/create-section-modal.module';
import { CourseAdminComponent } from './course-admin.component';
import { CourseAdminRoutingModule } from './course-admin.routing';

@NgModule({
  imports: [
    SharedModule,
    CourseAdminRoutingModule,
    CreateLessonModalModule,
    CreateSectionModalModule
  ],
  declarations: [CourseAdminComponent]
})
export class CourseAdminModule {}
