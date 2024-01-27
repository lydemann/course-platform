import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { ActionItemComponent } from './action-item/action-item.component';
import { ActionItemsComponent } from './action-items.component';

const EXPORTED_DECLARATIONS = [ActionItemsComponent];
const DECLARATIONS = [ActionItemComponent];

@NgModule({
  declarations: [...EXPORTED_DECLARATIONS, ...DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTED_DECLARATIONS],
})
export class ActionItemsModule {}
