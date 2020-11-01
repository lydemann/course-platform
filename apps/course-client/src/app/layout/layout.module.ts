import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TopbarComponent } from './topbar/topbar.component';

const declarations = [TopbarComponent];

@NgModule({
  declarations: [...declarations],
  imports: [CommonModule, SharedModule],
  exports: [...declarations],
  providers: []
})
export class LayoutModule {}
