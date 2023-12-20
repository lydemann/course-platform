import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { QuestionsComponent } from './questions.component';

const EXPORTED_DECLARATIONS = [QuestionsComponent];

@NgModule({
  declarations: [...EXPORTED_DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTED_DECLARATIONS],
})
export class QuestionsModule {}
