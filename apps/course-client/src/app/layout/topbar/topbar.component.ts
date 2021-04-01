import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { auth } from 'firebase';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CourseFacadeService } from '@course-platform/course-client-lib';
import { UserService } from '@course-platform/shared/feat-auth';

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
  logo = require('../../../assets/logo.png').default;
  loggedIn$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private courseClientFacade: CourseFacadeService
  ) {}

  ngOnInit() {
    this.loggedIn$ = this.userService.isLoggedIn$;
    this.homeUrl$ = this.courseClientFacade.courseId$.pipe(
      map((courseId) => `courses/${courseId ? courseId : ''}`)
    );
    this.navigationItems = [
      {
        link: 'https://theangulararc-zix2820.slack.com',
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
