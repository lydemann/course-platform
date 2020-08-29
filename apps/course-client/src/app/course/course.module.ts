import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CourseComponent } from './course.component';
import { FeatureRoutingModule } from './course.routing';
import { SectionComponent } from './section/section.component';

@NgModule({
  imports: [CommonModule, SharedModule, FeatureRoutingModule],
  declarations: [CourseComponent, SectionComponent]
})
export class CourseModule {}
