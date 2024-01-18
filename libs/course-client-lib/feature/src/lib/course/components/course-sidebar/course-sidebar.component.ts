import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';
import { SelectOptionComponent } from '@course-platform/shared/ui';
import { SectionLessonsComponent } from './section/section-lessons.component';

export interface SectionDropDownValue {
  value: string;
  name: string;
}

@Component({
  selector: 'app-course-sidebar',
  standalone: true,
  imports: [
    CourseSidebarComponent,
    SharedModule,
    SectionLessonsComponent,
    SelectOptionComponent,
  ],
  template: `<div class="sidebar">
    <div class="section-box">
      <small class="week-theme-label">WEEK THEME</small>
      <h5 class="week-theme">{{ selectedSection.theme }}</h5>
    </div>

    <div class="progress-bar-wrapper">
      <small class="label"
        >{{ sectionCompletedPct | number : '1.0-2' }}% complete</small
      >
      <mat-progress-bar
        class="progress-bar"
        mode="determinate"
        [value]="sectionCompletedPct"
      ></mat-progress-bar>
    </div>

    <app-select
      class="section-select-form-field"
      [value]="selectedSection.id"
      (valueChange)="sectionChanged.emit($event)"
    >
      <app-select-option *ngFor="let section of sections" [value]="section.id">
        {{ section.name }}
      </app-select-option>
    </app-select>

    <app-section-lessons
      [lessons]="lessons"
      [selectedLessonId]="selectedLessonId"
      (lessonSelected)="lessonSelected.emit($event)"
    ></app-section-lessons>
  </div> `,
  styleUrls: ['./course-sidebar.component.scss'],
})
export class CourseSidebarComponent {
  @Input() sections: CourseSection[];
  @Input() selectedSection: CourseSection;
  @Input() selectedLessonId: string;
  @Input() lessons: Lesson[];
  @Input() sectionCompletedPct: number;
  @Output() lessonSelected = new EventEmitter<string>();
  @Output() sectionChanged = new EventEmitter<string>();
}
