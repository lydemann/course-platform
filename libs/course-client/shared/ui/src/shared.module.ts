import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

import { SharedUiModule } from '@course-platform/shared/ui';
import { FeatureToggleModule } from '@course-platform/shared/util/util-feature-toggle';
import { AppMaterialModule } from './material.module';

// TODO: organize imports here
const imports = [];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedUiModule,
    RouterModule,
    FeatureToggleModule,
    AppMaterialModule,
    TranslateDirective,
    TranslatePipe,
  ],
  exports: [
    CommonModule,
    RouterModule,
    SharedUiModule,
    FeatureToggleModule,
    AppMaterialModule,
    TranslateDirective,
    TranslatePipe,
  ],
  providers: [],
})
export class SharedModule {}
