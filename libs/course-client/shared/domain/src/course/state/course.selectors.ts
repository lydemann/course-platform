import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  selectRouteData,
  selectRouteParam,
} from '@course-platform/shared/domain';
import {
  ActionItem,
  CourseSection,
  Lesson,
  LessonTypes,
} from '@course-platform/shared/interfaces';
import {
  selectedLessonIdRouteParam,
  selectedSectionIdRouteParam,
} from '../variables';
import {
  CourseState,
  courseLessonAdapter,
  courseSectionAdapter,
} from './course.model';

export namespace CourseSelectors {
  export const getCourseFeature = createFeatureSelector<CourseState>('course');

  const {
    selectAll: courseSectionsSelectAll,
    selectEntities: courseSectionsSelectEntities,
  } = courseSectionAdapter.getSelectors();
  const {
    selectAll: courseLessonsSelectAll,
    selectEntities: courseLessonsSelectEntities,
  } = courseLessonAdapter.getSelectors();

  export const selectIsLoadingSections = createSelector(
    getCourseFeature,
    (state) => {
      return state.sectionsState.isLoading;
    }
  );
  export const selectIsLoadingLessons = createSelector(
    getCourseFeature,
    (state) => {
      return state.lessonsState.isLoading;
    }
  );

  export const isCourseLoading = createSelector(
    selectIsLoadingSections,
    selectIsLoadingLessons,
    (isLoadingSections, isLoadingLessons) => {
      return isLoadingSections || isLoadingLessons;
    }
  );

  export const selectCourseSectionsState = createSelector(
    getCourseFeature,
    (state) => state.sectionsState
  );

  const selectCourseSectionsRaw = createSelector(
    selectCourseSectionsState,
    courseSectionsSelectAll
  );

  export const selectSectionsEntitiesRaw = createSelector(
    selectCourseSectionsState,
    courseSectionsSelectEntities
  );

  export const selectCourseLessonsState = createSelector(
    getCourseFeature,
    (state) => state.lessonsState
  );
  export const selectAllLessons = createSelector(
    selectCourseLessonsState,
    courseLessonsSelectAll
  );

  export const selectLessonsEntities = createSelector(
    selectCourseLessonsState,
    courseLessonsSelectEntities
  );

  export const selectSections = createSelector(
    selectCourseSectionsRaw,
    selectLessonsEntities,
    (sections, lessonsMap): CourseSection[] => {
      return sections.map((section) => ({
        ...section,
        lessons: section.lessons
          .map((lessonId) => lessonsMap[lessonId])
          .filter((lesson) => lesson !== undefined) as Lesson[],
      }));
    }
  );

  export const selectSectionEntities = createSelector(
    selectSections,
    (sections): { [key: string]: CourseSection } => {
      return sections.reduce(
        (acc, section) => ({ ...acc, [section.id]: section }),
        {}
      );
    }
  );

  export const selectSelectedSectionId = createSelector(
    selectRouteParam(selectedSectionIdRouteParam),
    (sectionId): string => sectionId
  );

  export const selectSelectedSection = createSelector(
    selectSectionEntities,
    selectSelectedSectionId,
    (sectionsMap, sectionId): CourseSection => {
      return sectionsMap[sectionId];
    }
  );

  export const selectSectionLessons = createSelector(
    selectSelectedSection,
    (selectedSection): Lesson[] => {
      return selectedSection?.lessons || [];
    }
  );

  export const selectSelectedLessonId = createSelector(
    selectRouteParam(selectedLessonIdRouteParam),
    selectRouteData,
    (lessonId, data) => {
      if (data['lessonType'] === LessonTypes.Lesson) {
        return lessonId;
      }

      return data['lessonType'];
    }
  );

  export const selectSectionActionItems = createSelector(
    selectSelectedSection,
    (selectedSection): ActionItem[] => {
      return selectedSection?.actionItems || [];
    }
  );

  export const selectSelectedLesson = createSelector(
    selectSelectedLessonId,
    selectLessonsEntities,
    selectRouteData,
    (selectedLessonId, courseLessons, data) => {
      if (data['lessonType'] !== LessonTypes.Lesson) {
        return null;
      }

      const lesson = courseLessons[selectedLessonId];

      if (!lesson) {
        throw new Error(`Lesson with id ${selectedLessonId} not found`);
      }
      return lesson;
    }
  );

  export const selectSectionCompletedPct = createSelector(
    selectSectionActionItems,
    (sectionActions) => {
      const numberOfCompleted = sectionActions.reduce(
        (acc: number, actionItem) => acc + (actionItem.isCompleted ? 1 : 0),
        0
      );

      return (numberOfCompleted / sectionActions.length) * 100;
    }
  );

  export const selectCourseId = createSelector(
    selectRouteParam('courseId'),
    (courseId): string => {
      return courseId;
    }
  );
}
