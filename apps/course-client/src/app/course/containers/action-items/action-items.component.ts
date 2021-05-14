import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CourseClientFacade } from '@course-platform/course-client-lib';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionItemsComponent implements OnInit {
  public actionItems$: Observable<ActionItem[]>;
  public selectedSectionId$: Observable<string>;

  constructor(private courseFacadeService: CourseClientFacade) {}
  ngOnInit(): void {
    this.actionItems$ = this.courseFacadeService.actionItems$;
    this.selectedSectionId$ = this.courseFacadeService.selectedSectionId$;
  }

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
