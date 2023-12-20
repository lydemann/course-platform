import { Component } from '@angular/core';
import {
  LayoutModule,
  SharedModule,
} from '@course-platform/course-client/shared/ui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [LayoutModule, SharedModule],
})
export class AppComponent {
  title = 'course-client';
  languages = ['en'];
  navigation = [
    { link: 'about', label: 'anms.menu.about' },
    { link: 'feature-list', label: 'anms.menu.features' },
    { link: 'examples', label: 'anms.menu.examples' },
  ];

  constructor(translateService: TranslateService) {
    translateService.use('en');
  }
}
