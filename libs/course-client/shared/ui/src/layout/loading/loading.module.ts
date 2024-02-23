import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { LoadingComponent } from './loading.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [LoadingComponent],
})
export class LoadingModule {}
