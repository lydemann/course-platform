import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SharedModule } from '@course-platform/course-client/shared/ui';

import { Lesson, LessonTypes } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-section-lessons',
  standalone: true,
  imports: [SharedModule],
  template: `<div class="lessons">
    <ul class="menu-vertical">
      <li
        class="lesson"
        data-test="lesson"
        *ngFor="let lesson of lessons"
        [class.selected]="lesson.id === selectedLessonId"
      >
        <a (click)="lessonSelected.emit(lesson.id)">
          <span>{{ lesson.name }}</span>
          <!-- TODO: save isComplete for user and check here -->
          <mat-icon class="icon" *ngIf="lesson.isCompleted"
            >check_circle</mat-icon
          >
        </a>
      </li>

      <li
        class="lesson"
        data-test="lesson"
        [class.selected]="lessonType.ActionItems === selectedLessonId"
      >
        <a routerLink="action-items"> Action items </a>
      </li>
    </ul>
  </div> `,
  styleUrls: ['./section-lessons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLessonsComponent {
  @Input() lessons: Lesson[];
  @Input() selectedLessonId: string;
  @Output() lessonSelected = new EventEmitter<string>();

  get lessonType() {
    return LessonTypes;
  }
}
