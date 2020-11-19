import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

import {
  CourseResourcesService,
  selectRouteParam
} from '@course-platform/shared/data-access';
import {
  ActionItem,
  Course,
  CourseSection,
  Lesson
} from '@course-platform/shared/interfaces';
import { CourseActions } from './state/course.actions';
import { CourseSelectors } from './state/course.selectors';

@Injectable({
  providedIn: 'root'
})
export class CourseFacadeService {
  constructor(
    private store: Store<any>,
    private courseResourcesService: CourseResourcesService
  ) {}
  actionItems$: Observable<ActionItem[]> = this.store.select(
    CourseSelectors.selectSectionActionItems
  );
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
    CourseSelectors.isCourseLoading
  );
  sectionLessons$: Observable<Lesson[]> = this.store.select(
    CourseSelectors.selectSectionLessons
  );
  selectedSectionId$ = this.store.select(
    CourseSelectors.selectSelectedSectionId
  );
  sectionCompletedPct$ = this.store.select(
    CourseSelectors.selectSectionCompletedPct
  );
  schoolId$ = this.store.select(selectRouteParam('schoolId'));
  courseId$ = this.store.select(selectRouteParam('courseId'));

  setSchoolId(schoolId: any) {
    auth().tenantId = schoolId;
  }
  getCourses(): Observable<Course[]> {
    return this.courseResourcesService.getCourses();
  }
  loadSections(courseId: string) {
    this.store.dispatch(CourseActions.loadSections({ courseId }));
  }
  onActionItemCompletedChanged(resourceId: string, completed: boolean) {
    this.store.dispatch(
      CourseActions.actionItemCompletedChanged({ resourceId, completed })
    );
  }
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
