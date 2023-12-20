import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { CourseContentComponent } from './course-content.component';

const EXPORTED_DECLARATIONS = [CourseContentComponent];

@NgModule({
  declarations: [...EXPORTED_DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTED_DECLARATIONS],
})
export class CourseContentModule {}
