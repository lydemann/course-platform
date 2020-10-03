import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-section-lessons',
  templateUrl: './section-lessons.component.html',
  styleUrls: ['./section-lessons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionLessonsComponent {
  @Input() lessons: Lesson[];
  @Input() selectedLessonId: string;
  @Output() lessonSelected = new EventEmitter<string>();
}
