import { Component, Input, OnInit } from '@angular/core';

import { CourseSection } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course-sidebar',
  templateUrl: './course-sidebar.component.html',
  styleUrls: ['./course-sidebar.component.scss']
})
export class CourseSidebarComponent implements OnInit {
  @Input() sections: CourseSection[];

  constructor() {}

  ngOnInit() {}
}
