import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CourseListEffects } from './course-list/state/course-list.effects';
import { courseListReducer } from './course-list/state/course-list.reducers';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forRoot([CourseListEffects]),
    StoreModule.forRoot({
      courseList: courseListReducer
    }),
    StoreDevtoolsModule.instrument()
  ]
})
export class CourseClientLibModule {}
