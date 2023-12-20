import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-client/shared/ui';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
