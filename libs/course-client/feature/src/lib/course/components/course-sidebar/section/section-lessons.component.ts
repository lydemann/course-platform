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
  imports: [SharedModule],
  template: `<div class="lessons">
    <ul class="menu-vertical">
      @for (lesson of lessons; track lesson) {
        <li
          class="lesson mr-4"
          data-test="lesson"
          [class.selected]="lesson.id === selectedLessonId"
        >
          <a
            role="button"
            tabindex="0"
            (click)="lessonSelected.emit(lesson.id)"
            (keydown.enter)="lessonSelected.emit(lesson.id)"
            class="flex items-center"
          >
            <span>{{ lesson.name }}</span>
            <!-- TODO: save isComplete for user and check here -->
            @if (lesson.isCompleted) {
              <mat-icon class="icon flex-shrink-0">check_circle</mat-icon>
            }
          </a>
        </li>
      }

      <li
        class="lesson"
        data-test="lesson"
        [class.selected]="lessonType.ActionItems === selectedLessonId"
      >
        <a routerLink="action-items"> Action items </a>
      </li>
    </ul>
  </div>`,
  styleUrls: ['./section-lessons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLessonsComponent {
  @Input() lessons: Lesson[] = [];
  @Input() selectedLessonId = '';
  @Output() lessonSelected = new EventEmitter<string>();

  get lessonType() {
    return LessonTypes;
  }
}
