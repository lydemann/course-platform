import { createReducer, on } from '@ngrx/store';

import { CourseActions, CourseActionsUnion } from './course.actions';
import {
  courseInitState,
  courseLessonAdapter,
  courseSectionAdapter,
  CourseState
} from './course.model';

export const courseReducer = createReducer<CourseState, CourseActionsUnion>(
  courseInitState,
  on(
    CourseActions.courseInitiated,
    (state, { selectedSectionId, selectedLessonId }) => ({
      ...state,
      sectionsState: {
        ...state.sectionsState,
        isLoading: true,
        selectedSectionId
      },
      lessonsState: {
        ...state.lessonsState,
        isLoading: true,
        selectedLessonId
      }
    })
  ),
  on(CourseActions.getCourseSectionsSuccess, (state, { courseSections }) => {
    return {
      ...state,
      sectionsState: {
        ...courseSectionAdapter.setAll(courseSections, state.sectionsState),
        isLoading: false
      }
    };
  }),
  on(CourseActions.getCourseSectionsFailed, (state, { error }) => ({
    ...state,
    sectionsState: {
      ...state.sectionsState,
      error,
      isLoading: false
    }
  })),
  on(CourseActions.getSectionLessonsSuccess, (state, { lessons }) => {
    return {
      ...state,
      lessonsState: {
        ...courseLessonAdapter.setAll(lessons, state.lessonsState),
        isLoading: false
      }
    };
  }),
  on(CourseActions.getSectionLessonsFailed, (state, { error }) => ({
    ...state,
    lessonsState: {
      ...state.lessonsState,
      error,
      isLoading: false
    }
  }))
);
