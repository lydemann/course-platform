import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
import { ActionItem } from '@course-platform/shared/interfaces';
import { ActionItemComponent } from './action-item/action-item.component';

export interface ActionItemAnswer {
  id: string;
  answer: boolean | string;
}

export const actionItemsRouteId = 'action-items';

@Component({
  selector: 'app-action-items',
  templateUrl: './action-items.component.html',
  styleUrls: ['./action-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SharedModule, ActionItemComponent],
})
export class ActionItemsComponent {
  public actionItems$: Observable<ActionItem[]> =
    this.courseFacadeService.actionItems$;
  public selectedSectionId$: Observable<string> =
    this.courseFacadeService.selectedSectionId$;

  constructor(private courseFacadeService: CourseClientFacade) {}

  public onCompleteChanged(
    resourceId: string,
    completed: boolean,
    sectionId: string
  ) {
    this.courseFacadeService.onActionItemCompletedChanged(
      resourceId,
      completed,
      sectionId
    );
  }
}
