import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CourseEffects } from './course/state/course.effects';
import { courseReducer } from './course/state/course.reducers';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forRoot([CourseEffects]),
    StoreModule.forRoot({
      course: courseReducer
    }),
    StoreDevtoolsModule.instrument()
  ]
})
export class CourseClientLibModule {}
