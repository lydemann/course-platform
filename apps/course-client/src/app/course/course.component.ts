import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CourseSection } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  sections$: Observable<CourseSection[]>;

  constructor() {}

  ngOnInit() {
    this.sections$ = of([
      {
        id: '1',
        name: 'Week 1',
        lessons: [
          {
            id: '1',
            title: '1. First lesson',
            description: 'This is the first lesson'
          },
          {
            id: '2',
            title: '2. Second lesson',
            description: 'This is the second lesson'
          }
        ]
      }
    ] as CourseSection[]);
  }
}
