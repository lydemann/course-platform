import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { SectionLessonsComponent } from './components/course-sidebar/section/section-lessons.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CourseContentModule } from './containers/course-content/course-content.module';
import { CourseComponent } from './course.component';
import { FeatureRoutingModule } from './course.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FeatureRoutingModule,
    CourseContentModule
  ],
  declarations: [
    CourseComponent,
    SectionLessonsComponent,
    TopbarComponent,
    CourseSidebarComponent
  ]
})
export class CourseModule {}
