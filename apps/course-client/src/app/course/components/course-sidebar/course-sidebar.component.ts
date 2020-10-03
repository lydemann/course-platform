import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
export class CourseSidebarComponent {
  @Input() sections: CourseSection[];
  @Input() selectedSectionId: string;
  @Input() selectedLessonId: string;
  @Input() lessons: Lesson[];
  @Output() lessonSelected = new EventEmitter<string>();
  @Output() sectionChanged = new EventEmitter<string>();
}
