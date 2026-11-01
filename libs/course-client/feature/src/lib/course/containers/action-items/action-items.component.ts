import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { SharedModule } from '@course-platform/course-client/shared/ui';
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
  imports: [SharedModule, ActionItemComponent],
})
export class ActionItemsComponent {
  public actionItems = toSignal(this.courseFacadeService.actionItems$, {
    initialValue: [],
  });
  public selectedSectionId = toSignal(
    this.courseFacadeService.selectedSectionId$,
  );

  constructor(private courseFacadeService: CourseClientFacade) {}

  public onCompleteChanged(
    resourceId: string,
    completed: boolean,
    sectionId: string,
  ) {
    this.courseFacadeService.onActionItemCompletedChanged(
      resourceId,
      completed,
      sectionId,
    );
  }
}
