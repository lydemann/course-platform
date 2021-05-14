import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { Observable } from 'rxjs';

import { CourseClientFacade } from '@course-platform/course-client-lib';
import { Course } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses$: Observable<Course[]>;

  constructor(
    private courseClientFacadeService: CourseClientFacade,
    private router: Router
  ) {}

  ngOnInit() {
    this.courses$ = this.courseClientFacadeService.getCourses();
  }

  courseSelected(courseId) {
    this.router.navigate(['courses', courseId]);
  }
}
