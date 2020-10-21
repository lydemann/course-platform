import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

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

  constructor(
    private courseFacadeService: CourseFacadeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // TODO: show loading spinner when loading
    this.isLoading$ = this.courseFacadeService.isLoading$;
    this.sections$ = this.courseFacadeService.sections$;
    this.lessons$ = this.courseFacadeService.sectionLessons$;
    this.selectedSectionId$ = this.route.params.pipe(
      pluck('selectedSectionId')
    );
    this.sectionLessons$ = this.courseFacadeService.sectionLessons$;
    this.selectedLesson$ = this.courseFacadeService.selectedLesson$;
  }

  onLessonSelected(selectedLessonId: string) {
    this.courseFacadeService.onLessonSelected(selectedLessonId);
  }

  onSectionSelected(selectionSectionId: string) {
    this.courseFacadeService.onSectionSelected(selectionSectionId);
  }
  onCompletedLessonClick(props: { isCompleted: boolean; lessonId: string }) {
    this.courseFacadeService.lessonCompleted(props);
  }
}
