import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';

import { CourseResourcesService } from '@course-platform/shared/data-access';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

interface CourseAdminStore {
  sections: CourseSection[];
  isLoadingCourseSections: boolean;
  loadCourseSectionsError: Error;
  currentSectionId: string;
  currentLessonId: string;
  isSavingLesson: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CourseAdminFacadeService {
  private courseAdminStore = new BehaviorSubject<CourseAdminStore>({
    isLoadingCourseSections: false,
    loadCourseSectionsError: null,
    sections: [],
    currentSectionId: null,
    currentLessonId: null,
    isSavingLesson: false
  });

  isLoadingCourseSections$: Observable<boolean>;
  sections$: Observable<CourseSection[]>;
  currentLesson$: Observable<Lesson>;
  currentSectionId$: Observable<string>;
  currentLessonId$: Observable<string>;

  constructor(
    private courseResourcesService: CourseResourcesService,
    private router: Router
  ) {
    this.sections$ = this.courseResourcesService.getCourseSections();
    this.isLoadingCourseSections$ = this.courseAdminStore.pipe(
      map(state => state.isLoadingCourseSections),
      distinctUntilChanged()
    );
    this.currentSectionId$ = this.courseAdminStore.pipe(
      map(state => state.currentSectionId),
      distinctUntilChanged()
    );
    this.currentLessonId$ = this.courseAdminStore.pipe(
      map(state => state.currentLessonId),
      distinctUntilChanged()
    );
    this.currentLesson$ = combineLatest([
      this.currentSectionId$,
      this.currentLessonId$,
      this.sections$
    ]).pipe(
      map(([sectionId, lessonId, sections]) => {
        return sections
          ?.find(section => section.id === sectionId)
          ?.lessons?.find(lesson => lesson.id === lessonId);
      }),
      filter(lesson => !!lesson)
    );
  }

  lessonInit(sectionId: string, lessonId: string) {
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      currentSectionId: sectionId,
      currentLessonId: lessonId
    });
  }

  saveLessonClicked(lesson: Lesson) {
    this.courseResourcesService.updateLesson(lesson).subscribe();
  }

  createLessonClicked(sectionId: string, section: string) {
    this.courseAdminStore.next({
      ...this.courseAdminStore.value,
      isSavingLesson: true
    });
    this.courseResourcesService
      .createLesson(sectionId, section)
      .subscribe(() => {
        this.courseAdminStore.next({
          ...this.courseAdminStore.value,
          sections: [...this.courseAdminStore.value.sections],
          isSavingLesson: false
        });
        // TODO: error handling
      });
  }

  deleteLessonClicked(sectionId: string, lessonId: string) {
    this.courseResourcesService
      .deleteLesson(sectionId, lessonId)
      .subscribe(() => {
        this.router.navigate(['course-admin']);
      });
  }
}
