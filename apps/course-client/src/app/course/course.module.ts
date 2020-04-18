import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseComponent } from './course.component';
import { FeatureRoutingModule } from './course.routing';
import { SectionComponent } from './section/section.component';

@NgModule({
  imports: [CommonModule, FeatureRoutingModule],
  declarations: [CourseComponent, SectionComponent]
})
export class CourseModule {}
