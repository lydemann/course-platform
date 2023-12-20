import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { HelpComponent } from './help.component';
import { HelpRoutingModule } from './help.routing';

@NgModule({
  imports: [CommonModule, HelpRoutingModule, SharedModule],
  declarations: [HelpComponent],
})
export class HelpModule {}
