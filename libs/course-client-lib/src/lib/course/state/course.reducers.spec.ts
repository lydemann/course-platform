import { HttpErrorResponse } from '@angular/common/http';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseActions } from './course.actions';
import { courseInitState, CourseState } from './course.model';
import { courseReducer } from './course.reducers';

describe('Course List reducers', () => {
  const initState = courseInitState;
  let updatedState: CourseState;

  describe('fetchSections', () => {
    beforeEach(() => {
      updatedState = courseReducer(
        initState,
        CourseActions.fetchCourseSections()
      );
    });

    it('should be loading', () => {
      expect(updatedState.isLoading).toBe(true);
    });
  });

  describe('fetchSectionsSuccess', () => {
    const courseSections = [{ id: '1' }] as CourseSection[];

    beforeEach(() => {
      updatedState = courseReducer(
        initState,
        CourseActions.getCourseSectionsSuccess({ courseSections })
      );
    });

    it('should not be loading', () => {
      expect(updatedState.isLoading).toBe(false);
    });

    it('should set the fetched sections', () => {
      expect(updatedState.entities).toStrictEqual({
        [courseSections[0].id]: courseSections[0]
      });
      expect(updatedState.ids).toStrictEqual([courseSections[0].id]);
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
      expect(updatedState.isLoading).toBe(false);
    });
    it('should set the error', () => {
      expect(updatedState.error).toBe(error);
    });
  });
});
