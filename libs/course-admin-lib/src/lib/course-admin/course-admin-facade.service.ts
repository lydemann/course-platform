import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CourseResourcesService } from '@course-platform/shared/data-access';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CourseAdminFacadeService {
  sections$: Observable<CourseSection[]>;
  currentLesson$: Observable<Lesson>;

  constructor(private courseResourcesService: CourseResourcesService) {}

  fetchLesson(sectionId: string, lessonId: string) {
    this.currentLesson$ = this.courseResourcesService.getLesson(
      sectionId,
      lessonId
    );
  }

  fetchCourseSectionsAndLessons() {
    this.sections$ = this.courseResourcesService.getCourseSectionsWithLessons();
  }
}
