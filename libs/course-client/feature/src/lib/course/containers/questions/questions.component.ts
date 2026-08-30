import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SharedModule } from '@course-platform/course-client/shared/ui';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  imports: [SharedModule],
})
export class QuestionsComponent {
  constructor() {}
}
