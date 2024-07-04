import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  imports: [CommonModule],
})
export class CourseAdminSharedDomainModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CourseAdminSharedDomainModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
