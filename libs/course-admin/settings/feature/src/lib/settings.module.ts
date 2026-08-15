import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './tabs/profile/profile.component';

@NgModule({
  declarations: [SettingsComponent],
  imports: [SharedModule, SettingsRoutingModule, ProfileComponent],
})
export class SettingsModule {}
