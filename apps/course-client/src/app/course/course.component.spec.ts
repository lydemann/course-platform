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

import { CourseFacadeService } from '@course-platform/course-client-lib';
import { CourseContentComponent } from './components/course-content/course-content.component';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { SectionLessonsComponent } from './components/course-sidebar/section/section-lessons.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { CourseComponent } from './course.component';

describe('CourseComponent', () => {
  let spectator: Spectator<CourseComponent>;
  let courseFacadeService: SpyObject<CourseFacadeService>;
  const createComponent = createComponentFactory({
    component: CourseComponent,
    declarations: [
      MockComponent(SectionLessonsComponent),
      MockComponent(TopbarComponent),
      MockComponent(CourseSidebarComponent),
      MockComponent(CourseContentComponent)
    ],
    providers: [
      mockProvider(CourseFacadeService, {
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
    courseFacadeService = spectator.inject(CourseFacadeService);
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
