import { inject, NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@NgModule({
  imports: [],
})
export class CoreModule {
  private readonly parentModule = inject(CoreModule, {
    optional: true,
    skipSelf: true,
  });
  private readonly translateService = inject(TranslateService);

  constructor() {
    if (this.parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }

    this.translateService.use('en');
  }
}
