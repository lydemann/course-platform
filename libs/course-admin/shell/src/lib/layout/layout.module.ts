import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@course-platform/course-admin/shared/ui';
import { LayoutRoutingModule } from './layout-routes.module';
import { LayoutComponent } from './layout.component';
import { TopbarModule } from './topbar/topbar.module';

const declarations = [LayoutComponent];

@NgModule({
  declarations: [...declarations],
  imports: [CommonModule, SharedModule, LayoutRoutingModule, TopbarModule],
  exports: [...declarations, TopbarModule],
  providers: [],
})
export class LayoutModule {}
