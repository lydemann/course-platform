import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { AppMaterialModule } from '../material/material.module';

const exportedDeclarations = [ButtonComponent];

@NgModule({
  imports: [CommonModule, AppMaterialModule],
  declarations: [...exportedDeclarations],
  exports: [...exportedDeclarations]
})
export class ButtonModule {}
