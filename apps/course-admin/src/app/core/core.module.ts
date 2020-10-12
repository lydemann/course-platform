import { NgModule, Optional, SkipSelf } from '@angular/core';

import { SharedDataAccessModule } from '@course-platform/shared/data-access';

@NgModule({
  imports: [SharedDataAccessModule]
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
