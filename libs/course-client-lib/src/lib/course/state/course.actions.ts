import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';

import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

export interface CourseInitiatedProps {
  selectedSectionId: string;
  selectedLessonId: string;
}

export interface LessonCompletedProps {
  lessonId: string;
  isCompleted: boolean;
}

export namespace CourseActions {
  export const courseInitiated = createAction('[Course] Course Initiated');
  export const loadSections = createAction(
    '[Course] Load Sections',
    props<{ courseId: string }>()
  );
  export const lessonChanged = createAction(
    '[Course] Lesson Changed',
    props<{ selectedLessonId: string }>()
  );
  export const sectionSelected = createAction(
    '[Course] Section Selected',
    props<{ selectedSectionId: string }>()
  );
  export const getCourseSectionsSuccess = createAction(
    '[Course] Get Course Sections Success',
    props<{ courseSections: CourseSection[] }>()
  );
  export const getCourseSectionsFailed = createAction(
    '[Course] Get Course Sections Failed',
    props<{ error: HttpErrorResponse }>()
  );

  export const sectionChanged = createAction(
    '[Course] Section Changed',
    props<{ sectionId: string }>()
  );
  export const getSectionLessonsSuccess = createAction(
    '[Course] Get Section Lessons Success',
    props<{ lessons: Lesson[] }>()
  );
  export const sectionChangedSectionLessonsSuccess = createAction(
    '[Course] Section Changed Section Lessons Success',
    props<{ lessons: Lesson[]; selectionSectionId: string }>()
  );
  export const getSectionLessonsFailed = createAction(
    '[Course] Get Section Lessons Failed',
    props<{ error: HttpErrorResponse }>()
  );

  export const lessonCompleted = createAction(
    '[Course] Complete Button Clicked',
    props<LessonCompletedProps>()
  );

  export const lessonCompletedSuccess = createAction(
    '[Course] Lesson Completed Success'
  );
  export const lessonCompletedFailed = createAction(
    '[Course] Lesson Completed Failed',
    props<{ error: Error }>()
  );

  export const actionItemCompletedChanged = createAction(
    '[Course] Action Item Completed Changed',
    props<{ resourceId: string; completed: boolean; sectionId: string }>()
  );

  export const setActionItemCompletedSuccess = createAction(
    '[Course] Set Action Item Completed Success'
  );

  export const setActionItemCompletedFailed = createAction(
    '[Course] Set Action Item Completed Failed',
    props<{
      error: HttpErrorResponse;
      resourceId: string;
      completed: boolean;
      sectionId: string;
    }>()
  );

  export const all = union({
    courseInitiated,
    getCourseSectionsSuccess,
    getCourseSectionsFailed,
    sectionChangedSectionLessonsSuccess,
    getSectionLessonsFailed,
    lessonCompleted,
    lessonCompletedSuccess,
    lessonCompletedFailed,
    actionItemCompletedChanged,
    setActionItemCompletedSuccess,
    setActionItemCompletedFailed
  });
}

export type CourseActionsUnion = typeof CourseActions.all;
