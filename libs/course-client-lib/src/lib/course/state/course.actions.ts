import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props, union } from '@ngrx/store';

import { CourseSection, Lesson } from '@course-platform/shared/interfaces';
import { LessonsState } from './course.model';

export interface CourseInitiatedProps {
  selectedSectionId: string;
}

export namespace CourseActions {
  export const courseInitiated = createAction(
    '[Course] Course Initiated',
    props<CourseInitiatedProps>()
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
  export const getSectionLessonsFailed = createAction(
    '[Course] Get Section Lessons Failed',
    props<{ error: HttpErrorResponse }>()
  );

  export const all = union({
    courseInitiated,
    getCourseSectionsSuccess,
    getCourseSectionsFailed
  });
}

export type CourseActionsUnion = typeof CourseActions.all;
