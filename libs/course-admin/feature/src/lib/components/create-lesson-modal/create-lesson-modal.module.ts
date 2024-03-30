import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SharedUiModule } from '@course-platform/shared/ui';
import { CreateLessonModalComponent } from './create-lesson-modal.component';

@NgModule({
  imports: [SharedModule, FormsModule, SharedUiModule],
  declarations: [CreateLessonModalComponent],
})
export class CreateLessonModalModule {}
