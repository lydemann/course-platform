import { NgModule } from '@angular/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';

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
    TranslateDirective,
    TranslatePipe,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    LayoutModule,
    TopbarModule,
    TranslateDirective,
    TranslatePipe,
  ],
})
export class RemoteEntryModule {}
