import { Component } from '@angular/core';
import { SharedModule } from '@course-platform/course-client/shared/ui';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  standalone: true,
  imports: [SharedModule],
})
export class QuestionsComponent {
  constructor() {}
}
