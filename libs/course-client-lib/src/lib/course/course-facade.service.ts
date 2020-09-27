import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CourseSection, Lesson } from '@course-platform/shared/interfaces';
import { CourseActions, CourseInitiatedProps } from './state/course.actions';
import { CourseState } from './state/course.model';
import { CourseSelectors } from './state/course.selectors';

@Injectable({
  providedIn: 'root'
})
export class CourseFacadeService {
  sections$: Observable<CourseSection[]> = this.store.select(
    CourseSelectors.selectCourseSections
  );
  isLoading$: Observable<boolean> = this.store.select(
    CourseSelectors.isCourseLoading,
    isLoading => isLoading
  );
  sectionLessons$: Observable<Lesson[]> = this.store.select(
    CourseSelectors.selectCourseLessons
  );
  selectedSectionId$ = this.store.select(
    CourseSelectors.selectSelectedSectionId
  );

  constructor(private store: Store<CourseState>) {}

  courseInitiated(props: CourseInitiatedProps) {
    this.store.dispatch(CourseActions.courseInitiated(props));
  }
}
