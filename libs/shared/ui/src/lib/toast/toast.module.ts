import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { AppMaterialModule } from '../material/material.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, AppMaterialModule],
  exports: [],
  providers: [ToastService],
})
export class ToastModule {}
