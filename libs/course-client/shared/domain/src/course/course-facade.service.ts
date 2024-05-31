import { Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter } from 'rxjs';

import {
  CourseResourcesService,
  State,
  selectRouteParam,
} from '@course-platform/shared/domain';
import {
  ActionItem,
  Course,
  CourseSection,
  Lesson,
} from '@course-platform/shared/interfaces';
import { CourseActions } from './state/course.actions';
import { CourseSelectors } from './state/course.selectors';

@Injectable({
  providedIn: 'root',
})
export class CourseClientFacade {
  courses = signal<Course[]>([]);

  constructor(
    private store: Store<State>,
    private courseResourcesService: CourseResourcesService
  ) {}

  actionItems$: Observable<ActionItem[]> = this.store.select(
    CourseSelectors.selectSectionActionItems
  );
  selectedLesson$: Observable<Lesson> = this.store
    .select(CourseSelectors.selectSelectedLesson)
    .pipe(filter((lesson) => !!lesson)) as Observable<Lesson>;
  selectedLessonId$: Observable<string> = this.store.select(
    CourseSelectors.selectSelectedLessonId
  );
  sections$: Observable<CourseSection[]> = this.store.select(
    CourseSelectors.selectSections
  );
  isLoading$: Observable<boolean> = this.store.select(
    CourseSelectors.isCourseLoading
  );
  isLoading = this.store.selectSignal(CourseSelectors.isCourseLoading);
  sectionLessons$: Observable<Lesson[]> = this.store.select(
    CourseSelectors.selectSectionLessons
  );
  selectedSectionId$ = this.store.select(
    CourseSelectors.selectSelectedSectionId
  );
  selectedSection$ = this.store.select(CourseSelectors.selectSelectedSection);
  sectionCompletedPct$ = this.store.select(
    CourseSelectors.selectSectionCompletedPct
  );
  schoolId$ = this.store.select(selectRouteParam('schoolId'));
  courseId$ = this.store.select(selectRouteParam('courseId'));

  getCourses(): Observable<Course[]> {
    return this.courseResourcesService.getCourses();
  }

  fetchCourses() {
    this.courseResourcesService.getCourses().subscribe((courses) => {
      this.courses.set(courses);
    });
  }

  loadSections(courseId: string) {
    this.store.dispatch(CourseActions.loadSections({ courseId }));
  }
  onActionItemCompletedChanged(
    resourceId: string,
    completed: boolean,
    sectionId: string
  ) {
    this.store.dispatch(
      CourseActions.actionItemCompletedChanged({
        resourceId,
        completed,
        sectionId,
      })
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
