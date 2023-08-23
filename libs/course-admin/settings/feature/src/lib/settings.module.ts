import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { CustomDomainComponent } from './tabs/custom-domain/custom-domain.component';
import { ProfileComponent } from './tabs/profile/profile.component';

@NgModule({
  declarations: [SettingsComponent, CustomDomainComponent],
  imports: [SharedModule, SettingsRoutingModule, ProfileComponent],
})
export class SettingsModule {}
