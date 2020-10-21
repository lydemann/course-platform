import { HttpErrorResponse } from '@angular/common/http';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseActions } from './course.actions';
import { courseInitState, CourseState } from './course.model';
import { courseReducer } from './course.reducers';

fdescribe('Course List reducers', () => {
  const initState = courseInitState;
  let updatedState: CourseState;

  describe('fetchSections', () => {
    beforeEach(() => {
      updatedState = courseReducer(initState, CourseActions.courseInitiated());
    });

    it('should be loading', () => {
      expect(updatedState.sectionsState.isLoading).toBe(true);
      expect(updatedState.lessonsState.isLoading).toBe(true);
    });
  });

  describe('fetchSectionsSuccess', () => {
    const courseSections = [{ id: '1', lessons: [] }] as CourseSection[];

    beforeEach(() => {
      updatedState = courseReducer(
        initState,
        CourseActions.getCourseSectionsSuccess({ courseSections })
      );
    });

    it('should not be loading', () => {
      expect(updatedState.sectionsState.isLoading).toBe(false);
    });

    it('should set the fetched sections', () => {
      expect(updatedState.sectionsState.entities).toStrictEqual({
        [courseSections[0].id]: courseSections[0]
      });
      expect(updatedState.sectionsState.ids).toStrictEqual([
        courseSections[0].id
      ]);
    });
  });

  describe('fetchSectionsFailed', () => {
    const error = { error: 'some error' } as HttpErrorResponse;
    beforeEach(() => {
      updatedState = courseReducer(
        initState,
        CourseActions.getCourseSectionsFailed({ error })
      );
    });
    it('should not be loading', () => {
      expect(updatedState.sectionsState.isLoading).toBe(false);
    });
    it('should set the error', () => {
      expect(updatedState.sectionsState.error).toBe(error);
    });
  });
});
