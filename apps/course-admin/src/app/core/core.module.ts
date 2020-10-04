import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularFireModule } from '@angular/fire';

import { environment } from '../../environments/environment';

@NgModule({
  imports: [AngularFireModule.initializeApp(environment.firebaseConfig)]
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
