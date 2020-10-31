import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CourseFacadeService } from '@course-platform/course-client-lib';
import { ActionItem, LessonResource } from '@course-platform/shared/interfaces';

export interface ActionItemAnswer {
  id: string;
  answer: boolean | string;
}

export const actionItemsRouteId = 'action-items';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionItemsComponent {
  public actionItems$: Observable<ActionItem[]>;

  constructor(private courseFacadeService: CourseFacadeService) {
    this.actionItems$ = courseFacadeService.actionItems$;
  }

  public onCompleteChanged(resourceId: string, completed: boolean) {
    this.courseFacadeService.onActionItemCompletedChanged(
      resourceId,
      completed
    );
  }
}
