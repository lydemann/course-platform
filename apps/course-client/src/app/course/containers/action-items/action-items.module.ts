import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { ActionItemsComponent } from './action-items.component';

const EXPORTED_DECLARATIONS = [ActionItemsComponent];

@NgModule({
  declarations: [...EXPORTED_DECLARATIONS],
  imports: [SharedModule],
  exports: [...EXPORTED_DECLARATIONS]
})
export class ActionItemsModule {}
