import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedDataAccessModule } from '@course-platform/shared/domain';

@NgModule({
  imports: [CommonModule, SharedDataAccessModule],
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
