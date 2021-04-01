import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { auth } from 'firebase';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  switchMap,
} from 'rxjs/operators';

import { CourseResourcesService } from '@course-platform/shared/data-access';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

interface CourseAdminStore {
  sections: CourseSection[];
  isLoadingCourseSections: boolean;
  loadCourseSectionsError: Error;
  currentSectionId: string;
  currentLessonId: string;
  isSavingLesson: boolean;
  currentCourseId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CourseAdminFacadeService {
  constructor(
    private courseResourcesService: CourseResourcesService,
    private router: Router
  ) {
    this.currentCourseId$ = this.courseAdminStore.pipe(
      map((store) => store.currentCourseId)
    );
    this.sections$ = this.courseAdminStore.pipe(
      map((store) => store.currentCourseId),
      filter((courseId) => !!courseId),
      switchMap((courseId) =>
        this.courseResourcesService.getCourseSections(courseId)
      )
    );
    this.isLoadingCourseSections$ = this.courseAdminStore.pipe(
      map((state) => state.isLoadingCourseSections),
      distinctUntilChanged()
    );
    this.currentSectionId$ = this.courseAdminStore.pipe(
      map((state) => state.currentSectionId),
      distinctUntilChanged()
    );
    this.currentLessonId$ = this.courseAdminStore.pipe(
      map((state) => state.currentLessonId),
      distinctUntilChanged()
    );

    this.currentLesson$ = combineLatest([
      this.currentSectionId$,
      this.currentLessonId$,
      this.sections$,
    ]).pipe(
      map(([sectionId, lessonId, sections]) => {
        return sections
          ?.find((section) => section.id === sectionId)
          ?.lessons?.find((lesson) => lesson.id === lessonId);
      }),
      filter((lesson) => !!lesson)
    );

    this.currentSection$ = combineLatest([
      this.currentSectionId$,
      this.sections$,
    ]).pipe(
      map(([sectionId, sections]) => {
        return sections?.find((section) => section.id === sectionId);
      }),
      filter((lesson) => !!lesson)
    );
  }
  private courseAdminStore = new BehaviorSubject<CourseAdminStore>({
    isLoadingCourseSections: false,
    loadCourseSectionsError: null,
    sections: [],
    currentSectionId: null,
    currentLessonId: null,
    isSavingLesson: false,
    currentCourseId: null,
  });
  currentCourseId$: Observable<string>;
  isLoadingCourseSections$: Observable<boolean>;
  sections$: Observable<CourseSection[]>;
  currentLesson$: Observable<Lesson>;
  currentSectionId$: Observable<string>;
  currentSection$: Observable<CourseSection>;
  currentLessonId$: Observable<string>;

  goToCourseAdmin() {
    const courseId = this.courseAdminStore.value.currentCourseId;
    this.router.navigate(['course-admin', courseId]);
  }

  setSchoolId(schoolId: any) {
    auth().tenantId = schoolId;
  }

  courseAdminInit(courseId: string) {
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      currentCourseId: courseId,
    });
  }

  lessonInit(sectionId: string, lessonId: string) {
    // TODO: just get this from router params and delete method
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      currentSectionId: sectionId,
      currentLessonId: lessonId,
    });
  }

  sectionInit(sectionId: string) {
    // TODO: just get this from router params and delete method
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      currentSectionId: sectionId,
    });
  }

  saveLessonClicked(lesson: Lesson) {
    const courseId = this.courseAdminStore.value.currentCourseId;
    this.courseResourcesService
      .updateLesson(lesson, courseId)
      .pipe(first())
      .subscribe();
  }

  createSectionSubmitted(sectionName: string) {
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      isSavingLesson: true,
    });

    const courseId = this.courseAdminStore.value.currentCourseId;
    this.courseResourcesService
      .createSection(sectionName, courseId)
      .subscribe();
  }
  updateSectionSubmitted(section: Partial<CourseSection>) {
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      isSavingLesson: true,
    });
    const courseId = this.courseAdminStore.value.currentCourseId;
    this.courseResourcesService
      .updateSection(section.id, section.name, section.theme, courseId)
      .pipe(first())
      .subscribe();
  }
  deleteSectionSubmitted(sectionId: string) {
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      isSavingLesson: true,
    });
    const courseId = this.courseAdminStore.value.currentCourseId;
    this.courseResourcesService
      .deleteSection(sectionId, courseId)
      .subscribe(() => {
        this.router.navigate(['course-admin']);
      });
  }

  createLessonSubmitted(sectionId: string, section: string) {
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      isSavingLesson: true,
    });
    const courseId = this.courseAdminStore.value.currentCourseId;
    this.courseResourcesService
      .createLesson(sectionId, section, courseId)
      .subscribe(() => {
        this.courseAdminStore.next({
          ...this.courseAdminStore.value,
          sections: [...this.courseAdminStore.value.sections],
          isSavingLesson: false,
        });
        // TODO: error handling
      });
  }

  deleteLessonClicked(sectionId: string, lessonId: string) {
    const courseId = this.courseAdminStore.value.currentCourseId;

    this.courseResourcesService
      .deleteLesson(sectionId, lessonId, courseId)
      .subscribe(() => {
        this.router.navigate(['course-admin', courseId]);
      });
  }
}
