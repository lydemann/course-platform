import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routing';
import { LayoutModule } from './layout/layout.module';
import { TopbarModule } from './layout/topbar/topbar.module';

@NgModule({
  exports: [
    CommonModule,
    AppRoutingModule,
    LayoutModule,
    TopbarModule,
    TranslateModule,
  ],
  imports: [CommonModule, AppRoutingModule, LayoutModule, TopbarModule],
})
export class RemoteEntryModule {}
