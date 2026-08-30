import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';

@Component({
  selector: 'app-courses',
  template: `
    <h1 class="headline">Your Training Programs</h1>

    @if (courses()?.length) {
      <div class="mx-4">
        @for (course of courses(); track course) {
          <mat-card
            data-test="course"
            class="course-card mx-auto lg:w-1/3 sm:w-1/2"
            (click)="courseSelected(course.id)"
            ><mat-card-title class="text-center py-3">{{
              course.name
            }}</mat-card-title>
            <img
              mat-card-image
              src="/assets/img/login.jpg"
              alt="course picture"
            />
            <mat-card-content>
              <p>
                {{ course.description }}
              </p>
            </mat-card-content>
          </mat-card>
        }
      </div>
    } @else {
      <app-spinner class="center-in-parent"></app-spinner>
    }
  `,
  styles: `
    .course-card {
      cursor: pointer;
    }
    .headline {
      text-align: center;
      margin: 40px 0 25px 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SharedModule],
})
export class CoursesComponent {
  courses = this.courseClientFacadeService.courses;

  constructor(
    private courseClientFacadeService: CourseClientFacade,
    private router: Router,
  ) {
    this.courseClientFacadeService.fetchCourses();
  }

  courseSelected(courseId: string) {
    this.router.navigate(['courses', courseId]);
  }
}
