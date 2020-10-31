import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { CourseContentComponent } from './course-content.component';

const EXPORTED_DECLARATIONS = [CourseContentComponent];

@NgModule({
  declarations: [...EXPORTED_DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTED_DECLARATIONS]
})
export class CourseContentModule {}
