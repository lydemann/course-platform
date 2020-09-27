import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-section-lessons',
  templateUrl: './section-lessons.component.html',
  styleUrls: ['./section-lessons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionLessonsComponent implements OnInit {
  @Input() lessons: Lesson[];

  constructor() {}

  ngOnInit() {}
}
