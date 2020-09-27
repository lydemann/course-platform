import { Component, Input, OnInit } from '@angular/core';

import { CourseSection, Lesson } from '@course-platform/shared/interfaces';

export interface SectionDropDownValue {
  value: string;
  name: string;
}

@Component({
  selector: 'app-course-sidebar',
  templateUrl: './course-sidebar.component.html',
  styleUrls: ['./course-sidebar.component.scss']
})
export class CourseSidebarComponent implements OnInit {
  @Input() sections: CourseSection[];
  @Input() selectedSectionId: string;
  @Input() lessons: Lesson[];

  constructor() {}

  ngOnInit() {}
}
