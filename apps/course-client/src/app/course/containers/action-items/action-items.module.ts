import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { ActionItemComponent } from './action-item/action-item.component';
import { ActionItemsComponent } from './action-items.component';

const EXPORTED_DECLARATIONS = [ActionItemsComponent];
const DECLARATIONS = [ActionItemComponent];

@NgModule({
  declarations: [...EXPORTED_DECLARATIONS, ...DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTED_DECLARATIONS]
})
export class ActionItemsModule {}
