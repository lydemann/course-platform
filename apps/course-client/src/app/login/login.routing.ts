import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RedirectIfAuthenticatedResolver } from '../core/auth/redirect-if-authenticated.service copy';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: [RedirectIfAuthenticatedResolver]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
