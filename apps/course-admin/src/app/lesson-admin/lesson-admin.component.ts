import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-lesson-admin',
  templateUrl: './lesson-admin.component.html'
})
export class LessonAdminComponent implements OnInit {
  lesson$: Observable<Lesson>;
  constructor(private courseAdminFacade: CourseAdminFacadeService) {}

  ngOnInit() {
    this.lesson$ = this.courseAdminFacade.currentLesson$;
  }
}
