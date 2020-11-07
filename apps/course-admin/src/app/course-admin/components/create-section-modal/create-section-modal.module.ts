import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../../shared/shared.module';
import { CreateSectionModalComponent } from './create-section-modal.component';

@NgModule({
  imports: [SharedModule, FormsModule],
  declarations: [CreateSectionModalComponent]
})
export class CreateSectionModalModule {}
