import { Injectable, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';

import {
  CourseResourcesTrpcService,
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
  private courseResourcesTrpcService = inject(CourseResourcesTrpcService);

  constructor(private store: Store<State>) {}

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
    return this.courseResourcesTrpcService.getCourses();
  }

  fetchCourses() {
    this.courseResourcesTrpcService.getCourses().subscribe((courses) => {
      this.courses.set(courses);
    });
  }

  getCourseSections(courseId: string): Observable<CourseSection[]> {
    return this.courseResourcesTrpcService.getCourseSections(courseId);
  }

  loadSections(courseId: string) {
    this.store.dispatch(CourseActions.loadSections({ courseId }));
  }

  onActionItemCompletedChanged(
    actionItemId: string,
    completed: boolean,
    sectionId: string
  ) {
    this.store.dispatch(
      CourseActions.actionItemCompletedChanged({
        actionItemId,
        completed,
        sectionId,
      })
    );
  }

  getCourse(courseId: string): Observable<Course> {
    return this.getCourses().pipe(
      map((courses) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course) {
          throw new Error(`Course not found ${courseId}`);
        }
        return course;
      })
    );
  }

  getCourseCustomStyling(courseId: string): Observable<string> {
    return this.getCourse(courseId).pipe(map((course) => course.customStyling));
  }

  lessonComplete(lessonId: string, isCompleted: boolean) {
    this.courseResourcesTrpcService
      .setCompleteLesson(isCompleted, lessonId)
      .subscribe();
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
