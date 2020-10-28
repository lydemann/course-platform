import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../../../shared/shared.module';
import { CreateLessonModalComponent } from './create-lesson-modal.component';

@NgModule({
  imports: [SharedModule, FormsModule],
  declarations: [CreateLessonModalComponent]
})
export class CreateLessonModalModule {}
