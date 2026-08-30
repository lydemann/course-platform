import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from '@course-platform/course-client/shared/ui';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SharedModule],
})
export class QuestionsComponent {
  constructor() {}
}
