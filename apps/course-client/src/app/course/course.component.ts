import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CourseFacadeService } from '@course-platform/course-client-lib';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  sections$: Observable<CourseSection[]>;
  lessons$: Observable<Lesson[]>;
  isLoading$: Observable<Boolean>;
  selectedSectionId$: Observable<string>;
  selectedLesson$: Observable<Lesson>;
  sectionLessons$: Observable<Lesson[]>;

  constructor(private courseFacadeService: CourseFacadeService) {}

  ngOnInit() {
    // TODO: show loading spinner when loading
    this.isLoading$ = this.courseFacadeService.isLoading$;
    this.sections$ = this.courseFacadeService.sections$;
    this.lessons$ = this.courseFacadeService.sectionLessons$;
    this.selectedSectionId$ = this.courseFacadeService.selectedSectionId$;
    this.sectionLessons$ = this.courseFacadeService.sectionLessons$;
    this.selectedLesson$ = this.courseFacadeService.selectedLesson$;
  }

  onLessonSelected(selectedLessonId: string) {
    this.courseFacadeService.onLessonSelected(selectedLessonId);
  }
}
