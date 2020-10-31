import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CourseSection, Lesson } from '@course-platform/shared/interfaces';
import { CourseActions } from './state/course.actions';
import { CourseSelectors } from './state/course.selectors';

@Injectable({
  providedIn: 'root'
})
export class CourseFacadeService {
  constructor(private store: Store<any>) {}
  selectedLesson$: Observable<Lesson> = this.store.select(
    CourseSelectors.selectSelectedLesson
  );
  selectedLessonId$: Observable<string> = this.store.select(
    CourseSelectors.selectSelectedLessonId
  );
  sections$: Observable<CourseSection[]> = this.store.select(
    CourseSelectors.selectSections
  );
  isLoading$: Observable<boolean> = this.store.select(
    CourseSelectors.isCourseLoading,
    isLoading => isLoading
  );
  sectionLessons$: Observable<Lesson[]> = this.store.select(
    CourseSelectors.selectSectionLessons
  );
  selectedSectionId$ = this.store.select(
    CourseSelectors.selectSelectedSectionId
  );
  onSectionSelected(selectionSectionId: string) {
    this.store.dispatch(
      CourseActions.sectionSelected({ selectedSectionId: selectionSectionId })
    );
  }
  onLessonSelected(selectedLessonId: string) {
    this.store.dispatch(CourseActions.lessonChanged({ selectedLessonId }));
  }
  courseInitiated() {
    this.store.dispatch(CourseActions.courseInitiated());
  }
  lessonCompleted(props: { lessonId: string; isCompleted: boolean }) {
    this.store.dispatch(CourseActions.lessonCompleted(props));
  }
}
