import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, LoginRoutingModule],
  declarations: [LoginComponent]
})
export class LoginModule {}
