/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, finalize, map, switchMap } from 'rxjs/operators';

import { CourseResourcesService } from '@course-platform/shared/domain';
import { injectTRPCClient } from '@course-platform/shared/domain/trpc-client';
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
  tenantId = '';

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
  private trpcClient = injectTRPCClient();

  constructor(
    private courseResourcesService: CourseResourcesService,
    private router: Router
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
        switchMap((courseId) =>
          this.courseResourcesService.getCourseSections(courseId!)
        )
      )
      .subscribe((sections) => {
        this.setSections(sections);
      });
  }

  createCourseSubmitted(course: Course) {
    return this.trpcClient.course.create.mutate({
      id: course.id,
      name: course.name,
      description: course.description,
    });
  }

  goToCourseAdmin() {
    const courseId = this.get((state) => state.currentCourseId);
    this.router.navigate(['../course-admin', courseId]);
  }

  setSchoolId(schoolId: string) {
    this.tenantId = schoolId;
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
    return this.trpcClient.course.update
      .mutate({
        id: editedCourse.id,
        name: editedCourse.name,
        description: editedCourse.description,
        customStyling: editedCourse.customStyling,
      })
      .pipe(
        finalize(() => {
          this.isEditingCourse.set(false);
        })
      );
  }

  deleteCourseSubmitted(courseId: string) {
    return this.trpcClient.course.delete.mutate({
      id: courseId,
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
    this.trpcClient.lesson.moveLesson
      .mutate({
        sectionId,
        previousIndex,
        currentIndex,
        courseId,
      })
      .subscribe();
  }

  createSectionSubmitted(sectionName: string) {
    this.setIsCreatingSection(true);

    const courseId = this.get((state) => state.currentCourseId)!;
    this.courseResourcesService.createSection(sectionName, courseId).subscribe({
      next: (createdSection) => {
        this._createSection({
          id: createdSection.id,
          name: createdSection?.name,
          lessons: [] as Lesson[],
        } as CourseSection);
      },
      error: (error) => {
        this.setIsCreatingSection(false);
        throw error;
      },
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
