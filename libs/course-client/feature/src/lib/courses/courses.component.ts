import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import { Course } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-courses',
  template: `
    <h1 class="headline">Your Training Programs</h1>

    <ng-container *ngIf="courses$ | async as courses; else loading">
      <div class="mx-4">
        <mat-card
          *ngFor="let course of courses"
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
      </div>
    </ng-container>

    <ng-template #loading>
      <app-spinner class="center-in-parent"></app-spinner>
    </ng-template>
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
  standalone: true,
  imports: [SharedModule],
})
export class CoursesComponent implements OnInit {
  courses$!: Observable<Course[]>;

  constructor(
    private courseClientFacadeService: CourseClientFacade,
    private router: Router
  ) {}

  ngOnInit() {
    this.courses$ = this.courseClientFacadeService.getCourses();
  }

  courseSelected(courseId: string) {
    this.router.navigate(['courses', courseId]);
  }
}
