import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedUiModule } from '@course-platform/shared/ui';
import { AppMaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AppMaterialModule, SharedUiModule, FlexLayoutModule],
  exports: [CommonModule, AppMaterialModule, SharedUiModule, FlexLayoutModule],
  providers: []
})
export class SharedModule {}
