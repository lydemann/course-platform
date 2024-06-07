/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import {
  catchError,
  filter,
  finalize,
  first,
  map,
  switchMap,
} from 'rxjs/operators';

import { Auth } from '@angular/fire/auth';
import {
  CourseResourcesService,
  GetCoursesResponseDTO,
  createInCache,
  removeFromCache,
} from '@course-platform/shared/domain';
import {
  Course,
  CourseSection,
  Lesson,
} from '@course-platform/shared/interfaces';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

interface CourseAdminStore {
  sections: CourseSection[];
  isLoadingCourseSections: boolean;
  loadCourseSectionsError: Error | null;
  currentSectionId?: string;
  currentLessonId?: string;
  isSavingLesson: boolean;
  isCreatingSection: boolean;
  currentCourseId: string | null;
}

export const EDIT_COURSE_MUTATION = gql`
  mutation editCourseMutation(
    $id: ID!
    $name: String!
    $description: String!
    $customStyling: String
  ) {
    updateCourse(
      id: $id
      name: $name
      description: $description
      customStyling: $customStyling
    ) {
      id
      name
      description
      customStyling
    }
  }
`;

export const CREATE_COURSE_MUTATION = gql`
  mutation createCourseMutation($name: String!, $description: String!) {
    createCourse(name: $name, description: $description) {
      id
      name
      description
    }
  }
`;

export const DELETE_COURSE_MUTATION = gql`
  mutation deleteCourseMutation($id: ID!) {
    deleteCourse(id: $id) {
      id
      name
      description
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CourseAdminFacadeService extends ComponentStore<CourseAdminStore> {
  readonly sections$ = this.select((state) => state.sections);
  readonly isLoadingCourseSections$ = this.select(
    (state) => state.isLoadingCourseSections
  );
  readonly loadCourseSectionsError$ = this.select(
    (state) => state.loadCourseSectionsError
  );
  readonly currentSectionId$ = this.select((state) => state.currentSectionId);
  readonly currentLessonId$ = this.select((state) => state.currentLessonId);
  currentCourseId$ = this.select((state) => state.currentCourseId);
  readonly currentSection$ = this.select(
    this.currentSectionId$,
    this.sections$,
    (sectionId, sections) => {
      return sections.find((section) => section.id === sectionId)!;
    }
  ).pipe(filter((section) => !!section));
  readonly currentLesson$ = this.select(
    this.currentLessonId$,
    this.currentSection$,
    (lessonId, section) => {
      return section.lessons.find((lesson) => lesson.id === lessonId)!;
    }
  ).pipe(filter((lesson) => !!lesson));
  private snapshot: CourseAdminStore | null = null;
  private _setLesson = this.updater((state, lesson: Lesson) => {
    const sectionIndex = state.sections.findIndex(
      (section) => section.id === state.currentSectionId
    );
    const section = { ...state.sections[sectionIndex] };
    const lessonIndex = section.lessons!.findIndex(
      (l) => l.id === state.currentLessonId
    );
    section.lessons![lessonIndex] = lesson;
    return {
      ...state,
      sections: state.sections,
    };
  });
  private _createSection = this.updater((state, section: CourseSection) => {
    return {
      ...state,
      isCreatingSection: false,
      sections: [
        ...state.sections,
        {
          ...section,
        },
      ],
    };
  });
  private _updateSection = this.updater((state, section: CourseSection) => {
    const sectionIndex = state.sections.findIndex((s) => s.id === section.id);
    state.sections[sectionIndex] = section;
    return {
      ...state,
      isSavingLesson: false,
      sections: [...state.sections],
    };
  });

  private _deleteLesson = this.updater(
    (
      state,
      { sectionId, lessonId }: { sectionId: string; lessonId: string }
    ) => {
      const sectionIndex = state.sections.findIndex((s) => s.id === sectionId);
      const section = state.sections[sectionIndex];
      const lessonIndex = section.lessons!.findIndex((l) => l.id === lessonId);
      section.lessons!.splice(lessonIndex, 1);
      return {
        ...state,
        isSavingLesson: false,
        sections: [...state.sections],
      };
    }
  );

  private _deleteSection = this.updater(
    (state, { sectionId }: { sectionId: string }) => {
      const sectionIndex = state.sections.findIndex((s) => s.id === sectionId);
      state.sections.splice(sectionIndex, 1);
      return {
        ...state,
        isSavingLesson: false,
        sections: [...state.sections],
      };
    }
  );

  private restoreLastSnapshot() {
    if (this.snapshot) {
      this.setState(this.snapshot);
    }
  }

  private createSnapshot() {
    this.snapshot = this.get();
  }

  private _createLesson = this.updater(
    (state, { lesson, sectionId }: { sectionId: string; lesson: Lesson }) => {
      const sectionIndex = state.sections.findIndex(
        (section) => section.id === sectionId
      );
      const section = state.sections[sectionIndex];
      section.lessons = [...section.lessons!, lesson];

      return {
        ...state,
        sections: [...state.sections],
      };
    }
  );

  getCourses(): Observable<Course[]> {
    return this.courseResourcesService.getCourses();
  }

  getCourse(courseId: string): Observable<Course> {
    return this.getCourses().pipe(
      map((courses) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course) {
          throw new Error(`Course not found ${courseId}`);
        }
        return course;
      })
    );
  }

  setSections = this.updater((state, sections: CourseSection[]) => ({
    ...state,
    sections,
    isLoadingCourseSections: false,
    loadCourseSectionsError: null,
  }));

  setIsLoadingCourseSections = this.updater(
    (state, isLoadingCourseSections: boolean) => ({
      ...state,
      isLoadingCourseSections: isLoadingCourseSections,
    })
  );

  setLoadCourseSectionsError = this.updater(
    (state, loadCourseSectionsError: Error) => ({
      ...state,
      loadCourseSectionsError: loadCourseSectionsError,
    })
  );
  setCourseId = this.updater((state, currentCourseId: string) => ({
    ...state,
    currentCourseId,
  }));
  setIsCreatingSection = this.updater((state, isCreatingSection: boolean) => ({
    ...state,
    isCreatingSection,
  }));

  isEditingCourse = signal(false);

  constructor(
    private courseResourcesService: CourseResourcesService,
    private router: Router,
    private apollo: Apollo,
    private auth: Auth
  ) {
    super({
      sections: [],
      isLoadingCourseSections: false,
      loadCourseSectionsError: null,
      isSavingLesson: false,
      currentCourseId: null,
      isCreatingSection: false,
    });

    // TODO: call this from top level resolver
    this.currentCourseId$
      .pipe(
        filter((courseId) => !!courseId),
        first(),
        switchMap((courseId) =>
          this.courseResourcesService.getCourseSections(courseId!)
        )
      )
      .subscribe((sections) => {
        this.setSections(sections);
      });
  }

  createCourseSubmitted(course: Course) {
    const getCoursesQuery = this.courseResourcesService.GET_COURSES_QUERY;

    return this.apollo.mutate<{ createCourse: Course }>({
      mutation: CREATE_COURSE_MUTATION,
      variables: {
        name: course.name,
        description: course.description,
      } as Course,
      update(cache, { data }) {
        createInCache<GetCoursesResponseDTO>(
          data!.createCourse,
          getCoursesQuery,
          cache,
          'course'
        );
      },
    });
  }

  goToCourseAdmin() {
    const courseId = this.get((state) => state.currentCourseId);
    this.router.navigate(['../course-admin', courseId]);
  }

  setSchoolId(schoolId: string) {
    this.auth.tenantId = schoolId;
  }

  courseAdminInit(courseId: string) {
    this.setCourseId(courseId);
  }

  lessonInit(sectionId: string, lessonId: string) {
    // TODO: just get this from router params and delete method
    this.patchState({
      currentSectionId: sectionId,
      currentLessonId: lessonId,
    });
  }

  sectionInit(sectionId: string) {
    // TODO: just get this from router params and delete method
    this.patchState({
      currentSectionId: sectionId,
    });
  }

  editCourseSubmitted(editedCourse: Course) {
    this.isEditingCourse.set(true);
    return this.apollo
      .mutate<Course>({
        mutation: EDIT_COURSE_MUTATION,
        variables: {
          id: editedCourse.id,
          name: editedCourse.name,
          description: editedCourse.description,
          customStyling: editedCourse.customStyling,
        } as Course,
      })
      .pipe(
        finalize(() => {
          this.isEditingCourse.set(false);
        })
      );
  }

  deleteCourseSubmitted(courseId: string) {
    const getCoursesQuery = this.courseResourcesService.GET_COURSES_QUERY;

    return this.apollo.mutate<{ deleteCourse: Course }>({
      mutation: DELETE_COURSE_MUTATION,
      variables: {
        id: courseId,
      } as Course,
      update(cache, { data }) {
        removeFromCache<GetCoursesResponseDTO>(
          data!.deleteCourse,
          getCoursesQuery,
          cache,
          'course'
        );
      },
    });
  }

  saveLesson(lesson: Lesson, sectionId: string) {
    const courseId = this.get((state) => state.currentCourseId)!;
    this.createSnapshot();
    this._setLesson(lesson);

    return this.courseResourcesService
      .updateLesson(lesson, courseId, sectionId)
      .pipe(
        catchError((error) => {
          this.restoreLastSnapshot();
          throw error;
        })
      );
  }

  moveLesson(
    sectionId: string,
    previousIndex: number,
    currentIndex: number,
    courseId: string
  ) {
    const MOVE_LESSON_MUTATION = gql`
      mutation moveLesson(
        $sectionId: ID!
        $previousIndex: Int!
        $currentIndex: Int!
        $courseId: ID!
      ) {
        moveLesson(
          sectionId: $sectionId
          previousIndex: $previousIndex
          currentIndex: $currentIndex
          courseId: $courseId
        )
      }
    `;

    this.apollo
      .mutate({
        mutation: MOVE_LESSON_MUTATION,
        variables: {
          sectionId,
          previousIndex,
          currentIndex,
          courseId,
        },
      })
      .subscribe();
  }

  createSectionSubmitted(sectionName: string) {
    this.setIsCreatingSection(true);

    const courseId = this.get((state) => state.currentCourseId)!;
    this.courseResourcesService
      .createSection(sectionName, courseId)
      .subscribe((section) => {
        if (section.errors) {
          this.setIsCreatingSection(false);
          throw new Error(section.errors[0].message);
        }

        const createdSection = section.data!;
        this._createSection({
          id: createdSection.id,
          name: createdSection?.name,
          lessons: createdSection?.lessons,
        } as CourseSection);
      });
  }

  updateSectionSubmitted(section: CourseSection) {
    this.patchState({
      isSavingLesson: true,
    });
    const courseId = this.get((state) => state.currentCourseId)!;
    this.courseResourcesService
      .updateSection(section.id, section.name, section.theme, courseId)
      .subscribe(() => {
        this._updateSection(section);
      });
  }

  deleteSectionSubmitted(sectionId: string) {
    this.patchState({
      isSavingLesson: true,
    });
    const courseId = this.get().currentCourseId!;
    this.courseResourcesService
      .deleteSection(sectionId, courseId)
      .subscribe(() => {
        this._deleteSection({ sectionId });
        this.router.navigate(['course-admin']);
      });
  }

  createLesson(sectionId: string, lessonName: string) {
    this.patchState({
      isSavingLesson: true,
    });
    const courseId = this.get().currentCourseId!;
    this.courseResourcesService
      .createLesson(sectionId, lessonName, courseId)
      .subscribe((lesson) => {
        this._createLesson({ lesson, sectionId });
      });
  }

  deleteLessonClicked(sectionId: string, lessonId: string) {
    const courseId = this.get().currentCourseId!;

    this.courseResourcesService
      .deleteLesson(sectionId, lessonId, courseId)
      .subscribe(() => {
        this._deleteLesson({ sectionId, lessonId });
        this.router.navigate(['admin', 'course-admin', courseId]);
      });
  }
}
