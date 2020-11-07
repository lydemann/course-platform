import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedUiModule } from '@course-platform/shared/ui';
import { AppMaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AppMaterialModule, SharedUiModule],
  exports: [CommonModule, AppMaterialModule, SharedUiModule],
  providers: []
})
export class SharedModule {}
