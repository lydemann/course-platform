import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureToggleModule } from '@course-platform/shared/util/util-feature-toggle';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, FeatureToggleModule],
  exports: [CommonModule, RouterModule, FeatureToggleModule],
  providers: []
})
export class SharedModule {}
