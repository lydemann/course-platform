import { MatProgressBar } from '@angular/material/progress-bar';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { CourseListFacadeService } from '@course-platform/course-client-lib';
import { CourseContentComponent } from './components/course-content/course-content.component';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { SectionComponent } from './components/course-sidebar/section/section.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CourseComponent } from './course.component';

describe('CourseComponent', () => {
  let spectator: Spectator<CourseComponent>;
  let courseListFacadeService: SpyObject<CourseListFacadeService>;
  const createComponent = createComponentFactory({
    component: CourseComponent,
    declarations: [
      MockComponent(SectionComponent),
      MockComponent(TopbarComponent),
      MockComponent(CourseSidebarComponent),
      MockComponent(CourseContentComponent)
    ],
    providers: [
      mockProvider(CourseListFacadeService, {
        sections$: of([
          {
            id: '1',
            name: 'Week 1',
            lessons: [
              {
                id: '1',
                title: '1. First lesson',
                description: 'This is the first lesson'
              },
              {
                id: '2',
                title: '2. Second lesson',
                description: 'This is the second lesson'
              }
            ]
          }
        ])
      })
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    courseListFacadeService = spectator.inject(CourseListFacadeService);
  });

  it('should get course sections', done => {
    spectator.component.sections$.pipe(first()).subscribe(sections => {
      const expectedSections = [
        {
          id: '1',
          name: 'Week 1',
          lessons: [
            {
              id: '1',
              title: '1. First lesson',
              description: 'This is the first lesson'
            },
            {
              id: '2',
              title: '2. Second lesson',
              description: 'This is the second lesson'
            }
          ]
        }
      ];
      expect(sections).toEqual(expectedSections);
      done();
    });
  });
});
