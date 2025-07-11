import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authSBGuard } from '@course-platform/shared/auth/domain';
import { SectionAdminComponent } from './section-admin.component';
import { SectionAdminResolver } from './section-admin.resolver';

const routes: Routes = [
  {
    path: ':sectionId',
    component: SectionAdminComponent,
    resolve: [SectionAdminResolver],
    canActivate: [authSBGuard],
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectionAdminRoutingModule {}
