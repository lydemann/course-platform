/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  switchMap,
} from 'rxjs/operators';

import { Auth } from '@angular/fire/auth';
import { CourseResourcesService } from '@course-platform/shared/domain';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

interface CourseAdminStore {
  sections: CourseSection[];
  isLoadingCourseSections: boolean;
  loadCourseSectionsError: Error | null;
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
    private router: Router,
    private apollo: Apollo,
    private auth: Auth
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
      map(([sectionId, lessonId, sections]) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        sections
          .find((section) => section.id === sectionId)!
          .lessons?.find((lesson) => lesson.id === lessonId)!
      ),
      filter((lesson) => !!lesson)
    );

    this.currentSection$ = combineLatest([
      this.currentSectionId$,
      this.sections$,
    ]).pipe(
      map(([sectionId, sections]) =>
        sections.find((section) => section.id === sectionId)!
      ),
      filter((lesson) => !!lesson)
    );
  }

  private courseAdminStore = new BehaviorSubject<CourseAdminStore>({
    isLoadingCourseSections: false,
    loadCourseSectionsError: null,
    sections: [],
    currentSectionId: '',
    currentLessonId: '',
    isSavingLesson: false,
    currentCourseId: '',
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
    this.auth.tenantId = schoolId;
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
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      isSavingLesson: true,
    });

    const courseId = this.courseAdminStore.value.currentCourseId;
    this.courseResourcesService
      .createSection(sectionName, courseId)
      .subscribe();
  }
  updateSectionSubmitted(section: CourseSection) {
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
