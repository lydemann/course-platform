import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AppMaterialModule } from './material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AppMaterialModule],
  exports: [CommonModule, AppMaterialModule],
  providers: []
})
export class SharedModule {}
