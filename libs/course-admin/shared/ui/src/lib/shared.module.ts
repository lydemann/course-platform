import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedUiModule } from '@course-platform/shared/ui';
import { AppMaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppMaterialModule,
    TranslateModule.forChild(),
    SharedUiModule,
    RouterModule,
    SharedUiModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    AppMaterialModule,
    SharedUiModule,
    TranslateModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class SharedModule {}
