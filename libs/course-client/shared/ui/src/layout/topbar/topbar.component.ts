import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import {
  AuthFBService,
  AuthService,
} from '@course-platform/shared/auth/domain';

interface NavigationItem {
  link: string;
  label: string;
  icon?: string;
  externalLink?: boolean;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  languages = ['en'];
  homeUrl$!: Observable<string>;
  navigationItems!: NavigationItem[];
  loggedIn$!: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private courseClientFacade: CourseClientFacade
  ) {
    this.loggedIn$ = this.authService.isLoggedIn();
    this.homeUrl$ = this.courseClientFacade.courseId$.pipe(
      map((courseId) => `courses/${courseId ? courseId : ''}`)
    );
    this.navigationItems = [
      {
        link: 'https://discord.gg/c8NxzFcwDP',
        label: 'Community',
        icon: 'groups',
        externalLink: true,
      },
      {
        link: `help`,
        label: 'Help',
        icon: 'help',
      },
      {
        link: `profile`,
        label: 'Profile',
        icon: 'person',
      },
    ];
  }
}
