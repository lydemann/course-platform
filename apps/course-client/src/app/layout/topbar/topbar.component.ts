import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  OnInit
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
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  languages = ['en'];
  homeUrl$: Observable<string>;
  navigationItems$: Observable<NavigationItem[]>;
  logo = require('../../../assets/logo.png').default;
  loggedIn$: Observable<boolean>;

  constructor(
    private userService: UserService,
    private courseClientFacade: CourseFacadeService
  ) {}

  ngOnInit() {
    this.loggedIn$ = this.userService.isLoggedIn$;
    this.homeUrl$ = combineLatest([
      this.courseClientFacade.schoolId$,
      this.courseClientFacade.courseId$
    ]).pipe(
      map(([schoolId, courseId]) =>
        schoolId ? `${schoolId}/${courseId ? courseId : ''}` : ''
      )
    );
    this.navigationItems$ = this.courseClientFacade.schoolId$.pipe(
      map(schoolId => {
        return [
          // TODO: add dropdowns here
          // TODO: add icons here
          {
            link: 'https://theangulararc-zix2820.slack.com',
            label: 'Community',
            icon: 'groups',
            externalLink: true
          },
          {
            link: `${schoolId}/help`,
            label: 'Help',
            icon: 'help'
          },
          // { link: 'help', label: 'Help', icon: 'info' },
          {
            link: `${schoolId}/profile`,
            label: 'Profile',
            icon: 'person'
          }
        ];
      })
    );
  }
}
