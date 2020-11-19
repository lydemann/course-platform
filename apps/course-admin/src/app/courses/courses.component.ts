import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { Course } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Course[]>;

  constructor(
    private courseAdminFacadeService: CourseAdminFacadeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.courses$ = this.courseAdminFacadeService.getCourses();
  }

  courseSelected(courseId) {
    this.router.navigate([auth().tenantId, 'course-admin', courseId]);
  }
}
