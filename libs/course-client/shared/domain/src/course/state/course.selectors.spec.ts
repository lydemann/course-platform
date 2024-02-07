import { courseInitState, CourseSectionStore } from './course.model';
import { CourseSelectors } from './course.selectors';

describe('Course list selectors', () => {
  const initState = courseInitState;
  describe('selectIsLoading', () => {
    it('should select isLoading', () => {
      initState.sectionsState.isLoading = true;

      const isLoading =
        CourseSelectors.selectIsLoadingSections.projector(initState);
      expect(isLoading).toBe(initState.sectionsState.isLoading);
    });
  });

  describe('getCourseSections', () => {
    it('should select course sections', () => {
      const courseSections = [
        { id: '1', lessons: [] as string[] } as CourseSectionStore,
      ];

      const sections = CourseSelectors.selectSections.projector(
        courseSections,
        {}
      );
      expect(sections).toEqual(courseSections);
    });
  });
});
