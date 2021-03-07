import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedUiModule } from '@course-platform/shared/ui';
import { AppMaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppMaterialModule,
    SharedUiModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    AppMaterialModule,
    SharedUiModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class SharedModule {}
