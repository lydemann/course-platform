import { CourseListFacadeService } from '@course-platform/course-client-lib';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject
} from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { CourseComponent } from './course.component';
import { SectionComponent } from './section/section.component';

describe('CourseComponent', () => {
  let spectator: Spectator<CourseComponent>;
  let courseListFacadeService: SpyObject<CourseListFacadeService>;
  const createComponent = createComponentFactory({
    component: CourseComponent,
    declarations: [SectionComponent],
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
