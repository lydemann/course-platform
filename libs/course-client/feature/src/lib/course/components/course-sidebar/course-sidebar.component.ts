import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { CourseSection, Lesson } from '@course-platform/shared/interfaces';
import { BrowserOnlyDirective } from '@course-platform/shared/ssr/ui';
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
    BrowserOnlyDirective,
  ],
  template: ` @if (selectedSection) {
    <div class="sidebar ml-4">
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
        <app-select-option
          *ngFor="let section of sections"
          [value]="section.id"
        >
          {{ section.name }}
        </app-select-option>
      </app-select>

      <app-section-lessons
        [lessons]="lessons"
        [selectedLessonId]="selectedLessonId"
        (lessonSelected)="lessonSelected.emit($event)"
      ></app-section-lessons>
    </div>
    }`,
  styleUrls: ['./course-sidebar.component.scss'],
})
export class CourseSidebarComponent {
  @Input() sections: CourseSection[] = [];
  @Input() selectedSection: CourseSection = {} as CourseSection;
  @Input() selectedLessonId = '';
  @Input() lessons: Lesson[] = [];
  @Input() sectionCompletedPct = 0;
  @Output() lessonSelected = new EventEmitter<string>();
  @Output() sectionChanged = new EventEmitter<string>();
}
