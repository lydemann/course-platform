import { Action, createReducer, on } from '@ngrx/store';
import { produce } from 'immer';

import { Lesson } from '@course-platform/shared/interfaces';
import { CourseActions, CourseActionsUnion } from './course.actions';
import {
  CourseState,
  courseInitState,
  courseLessonAdapter,
  courseSectionAdapter,
} from './course.model';

export const courseReducer = createReducer<
  CourseState,
  Action | CourseActionsUnion
>(
  courseInitState,
  on(CourseActions.courseInitiated, (state) => {
    return {
      ...state,
      sectionsState: {
        ...state.sectionsState,
        isLoading: true,
      },
      lessonsState: {
        ...state.lessonsState,
        isLoading: true,
      },
    };
  }),
  on(CourseActions.getCourseSectionsSuccess, (state, { courseSections }) => {
    return {
      ...state,
      sectionsState: {
        ...courseSectionAdapter.setAll(
          courseSections.map((section) => ({
            ...section,
            lessons: section.lessons.map((lesson) => lesson.id),
          })),
          state.sectionsState
        ),
        isLoading: false,
      },
      lessonsState: {
        ...courseLessonAdapter.setAll(
          courseSections.reduce(
            (prev: Lesson[], cur) => [...prev, ...cur.lessons],
            []
          ),
          state.lessonsState
        ),
        isLoading: false,
      },
    };
  }),
  on(CourseActions.getCourseSectionsFailed, (state, { error }) => {
    return {
      ...state,
      sectionsState: {
        ...state.sectionsState,
        error,
        isLoading: false,
      },
    };
  }),
  on(
    CourseActions.getSectionLessonsSuccess,
    CourseActions.sectionChangedSectionLessonsSuccess,
    (state, { lessons }) => {
      return {
        ...state,
        lessonsState: {
          ...courseLessonAdapter.setAll(lessons, state.lessonsState),
          isLoading: false,
        },
      };
    }
  ),
  on(CourseActions.getSectionLessonsFailed, (state, { error }) => ({
    ...state,
    lessonsState: {
      ...state.lessonsState,
      error,
      isLoading: false,
    },
  })),
  on(CourseActions.lessonCompleted, (state, { lessonId, isCompleted }) => {
    return {
      ...state,
      lessonsState: {
        ...courseLessonAdapter.updateOne(
          {
            id: lessonId,
            changes: { isCompleted },
          },
          state.lessonsState
        ),
      },
    };
  }),
  on(CourseActions.sectionSelected, (state, { selectedSectionId }) => {
    return {
      ...state,
      sectionsState: {
        ...state.sectionsState,
        selectedSectionId,
      },
    };
  }),
  on(
    CourseActions.actionItemCompletedChanged,
    (state, { completed, actionItemId, sectionId }) => {
      return produce<CourseState>(state, (draft) => {
        const section = draft.sectionsState.entities[sectionId];

        if (!section) {
          throw new Error(`Section not found with id: ${sectionId}`);
        }

        const actionItemToUpdate = section.actionItems.find(
          (actionItem) => actionItem.id === actionItemId
        );

        if (!actionItemToUpdate) {
          throw new Error(`Action item not found with id: ${actionItemId}`);
        }

        actionItemToUpdate.isCompleted = completed;
        return draft;
      });
    }
  ),
  on(
    CourseActions.setActionItemCompletedFailed,
    (state, { completed, actionItemId: resourceId, sectionId }) => {
      return produce<CourseState>(state, (draft) => {
        const section = draft.sectionsState.entities[sectionId];

        if (!section) {
          throw new Error(`Section not found with id: ${sectionId}`);
        }

        const actionItemToUpdate = section.actionItems.find(
          (actionItem) => actionItem.id === resourceId
        );

        if (!actionItemToUpdate) {
          throw new Error(`Action item not found with id: ${resourceId}`);
        }

        actionItemToUpdate.isCompleted = !completed;

        return draft;
      });
    }
  )
);
