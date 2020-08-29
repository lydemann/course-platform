import { HttpErrorResponse } from '@angular/common/http';

import { CourseSection } from '@course-platform/shared/interfaces';
import { CourseListActions } from './course-list.actions';
import { courseListInitState, CourseListState } from './course-list.model';
import { courseListReducer } from './course-list.reducers';

describe('Course List reducers', () => {
  const initState = courseListInitState;
  let updatedState: CourseListState;

  describe('fetchSections', () => {
    beforeEach(() => {
      updatedState = courseListReducer(
        initState,
        CourseListActions.fetchCourseSections()
      );
    });

    it('should be loading', () => {
      expect(updatedState.isLoading).toBe(true);
    });
  });

  describe('fetchSectionsSuccess', () => {
    const courseSections = [{ id: '1' }] as CourseSection[];

    beforeEach(() => {
      updatedState = courseListReducer(
        initState,
        CourseListActions.fetchCourseSectionsSuccess({ courseSections })
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
      updatedState = courseListReducer(
        initState,
        CourseListActions.fetchCourseSectionsFailed({ error })
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
