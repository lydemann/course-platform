import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FeatureToggleModule } from '@course-platform/shared/util/util-feature-toggle';
import { AppMaterialModule } from './material.module';

// TODO: organize imports here
const imports = [];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FeatureToggleModule,
    AppMaterialModule,
    TranslateModule.forChild()
  ],
  exports: [
    CommonModule,
    RouterModule,
    FeatureToggleModule,
    AppMaterialModule,
    TranslateModule
  ],
  providers: []
})
export class SharedModule {}
