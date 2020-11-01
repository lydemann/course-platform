import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HelpComponent } from './help.component';
import { HelpRoutingModule } from './help.routing';

@NgModule({
  imports: [CommonModule, HelpRoutingModule, SharedModule],
  declarations: [HelpComponent]
})
export class HelpModule {}
