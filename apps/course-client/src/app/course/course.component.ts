import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import {
  CourseFacadeService,
  selectedSectionIdRouteParam
} from '@course-platform/course-client-lib';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  sections$: Observable<CourseSection[]>;
  isLoading$: Observable<Boolean>;
  selectedSectionId$: Observable<string>;
  selectedLesson$: Observable<Lesson>;
  selectedLessonId$: Observable<string>;
  sectionLessons$: Observable<Lesson[]>;
  sectionCompletedPct$: Observable<number>;

  constructor(
    private courseFacadeService: CourseFacadeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading$ = this.courseFacadeService.isLoading$;
    this.sections$ = this.courseFacadeService.sections$;
    this.selectedSectionId$ = this.route.params.pipe(
      pluck(selectedSectionIdRouteParam)
    );
    this.sectionLessons$ = this.courseFacadeService.sectionLessons$;
    this.selectedLessonId$ = this.courseFacadeService.selectedLessonId$;
    this.sectionCompletedPct$ = this.courseFacadeService.sectionCompletedPct$;
  }

  onLessonSelected(selectedLessonId: string) {
    this.courseFacadeService.onLessonSelected(selectedLessonId);
  }

  onSectionSelected(selectionSectionId: string) {
    this.courseFacadeService.onSectionSelected(selectionSectionId);
  }
}
