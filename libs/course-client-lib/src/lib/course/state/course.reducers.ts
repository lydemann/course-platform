import { createReducer, on } from '@ngrx/store';
import { produce } from 'immer';

import { CourseActions, CourseActionsUnion } from './course.actions';
import {
  courseInitState,
  courseLessonAdapter,
  courseSectionAdapter,
  CourseState
} from './course.model';

export const courseReducer = createReducer<CourseState, CourseActionsUnion>(
  courseInitState,
  on(CourseActions.courseInitiated, state => ({
    ...state,
    sectionsState: {
      ...state.sectionsState,
      isLoading: true
    },
    lessonsState: {
      ...state.lessonsState,
      isLoading: true
    }
  })),
  on(CourseActions.getCourseSectionsSuccess, (state, { courseSections }) => {
    return {
      ...state,
      sectionsState: {
        ...courseSectionAdapter.setAll(
          courseSections.map(section => ({
            ...section,
            lessons: section.lessons.map(lesson => lesson.id)
          })),
          state.sectionsState
        ),
        isLoading: false
      },
      lessonsState: {
        ...courseLessonAdapter.setAll(
          courseSections.reduce((prev, cur) => [...prev, ...cur.lessons], []),
          state.lessonsState
        ),
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
  on(
    CourseActions.getSectionLessonsSuccess,
    CourseActions.sectionChangedSectionLessonsSuccess,
    (state, { lessons }) => {
      return {
        ...state,
        lessonsState: {
          ...courseLessonAdapter.setAll(lessons, state.lessonsState),
          isLoading: false
        }
      };
    }
  ),
  on(CourseActions.getSectionLessonsFailed, (state, { error }) => ({
    ...state,
    lessonsState: {
      ...state.lessonsState,
      error,
      isLoading: false
    }
  })),
  on(CourseActions.lessonCompleted, (state, { lessonId, isCompleted }) => {
    return {
      ...state,
      lessonsState: {
        ...courseLessonAdapter.updateOne(
          {
            id: lessonId,
            changes: { isCompleted }
          },
          state.lessonsState
        )
      }
    };
  }),
  on(CourseActions.sectionSelected, (state, { selectedSectionId }) => {
    return {
      ...state,
      sectionsState: {
        ...state.sectionsState,
        selectedSectionId
      }
    };
  }),
  on(
    CourseActions.actionItemCompletedChanged,
    (state, { completed, resourceId, sectionId }) => {
      return produce<CourseState>(state, draft => {
        const actionItemToUpdate = draft.sectionsState.entities[
          sectionId
        ].actionItems.find(actionItem => actionItem.id === resourceId);
        actionItemToUpdate.isCompleted = completed;

        return draft;
      });
    }
  ),
  on(
    CourseActions.setActionItemCompletedFailed,
    (state, { completed, resourceId, sectionId }) => {
      return produce<CourseState>(state, draft => {
        const actionItemToUpdate = draft.sectionsState.entities[
          sectionId
        ].actionItems.find(actionItem => actionItem.id === resourceId);
        actionItemToUpdate.isCompleted = !completed;

        return draft;
      });
    }
  )
);
