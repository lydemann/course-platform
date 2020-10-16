import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { CourseSection } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course-admin',
  templateUrl: './course-admin.component.html'
})
export class CourseAdminComponent implements OnInit {
  panelOpenState = false;
  sections$: Observable<CourseSection[]>;
  constructor(
    private courseAdminFacadeService: CourseAdminFacadeService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.sections$ = this.courseAdminFacadeService.sections$;
  }

  onLessonClicked(sectionId: string, lessonId: string) {
    this.router.navigate(['course-admin', 'lesson-admin', sectionId, lessonId]);
  }

  onCreateLessonClicked(sectionId: string) {
    this.courseAdminFacadeService.createLessonClicked(sectionId);
  }
}
