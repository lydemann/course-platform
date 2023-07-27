import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { CustomDomainComponent } from './tabs/custom-domain/custom-domain.component';

@NgModule({
  declarations: [SettingsComponent, CustomDomainComponent],
  imports: [SharedModule, SettingsRoutingModule],
})
export class SettingsModule {}
