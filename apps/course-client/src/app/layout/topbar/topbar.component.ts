import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CourseClientFacade } from '@course-platform/course-client-lib';
import { UserService } from '@course-platform/shared/auth-domain';

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
export class TopbarComponent implements OnInit {
  languages = ['en'];
  homeUrl$: Observable<string>;
  navigationItems: NavigationItem[];
  loggedIn$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private courseClientFacade: CourseClientFacade
  ) {}

  ngOnInit() {
    this.loggedIn$ = this.userService.isLoggedIn$;
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
