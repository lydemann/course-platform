import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SharedUiModule } from '@course-platform/shared/ui';
import { LessonAdminFormComponent } from './lesson-admin-form/lesson-admin-form.component';
import { LessonAdminComponent } from './lesson-admin.component';
import { LessonAdminRoutingModule } from './lesson-admin.routing';

@NgModule({
  imports: [
    SharedModule,
    LessonAdminRoutingModule,
    ReactiveFormsModule,
    SharedUiModule,
    LessonAdminFormComponent,
  ],
  declarations: [LessonAdminComponent],
})
export class LessonAdminModule {}
