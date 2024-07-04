import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { RemoteEntryModule } from '@course-platform/course-admin/shell';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RemoteEntryModule],
  standalone: true,
})
export class AppComponent {}
