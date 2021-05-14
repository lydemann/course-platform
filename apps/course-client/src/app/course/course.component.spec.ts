import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  CourseClientFacade,
  selectedSectionIdRouteParam,
} from '@course-platform/course-client-lib';
import { CourseFacadeService } from '@course-platform/shared/data-access';
import { SpinnerComponent } from '@course-platform/shared/ui';
import { TopbarComponent } from '../layout/topbar/topbar.component';
import { CourseSidebarComponent } from './components/course-sidebar/course-sidebar.component';
import { SectionLessonsComponent } from './components/course-sidebar/section/section-lessons.component';
import { CourseContentComponent } from './containers/course-content/course-content.component';
import { CourseComponent } from './course.component';

describe('CourseComponent', () => {
  let spectator: Spectator<CourseComponent>;
  let courseFacadeService: SpyObject<CourseClientFacade>;
  const createComponent = createComponentFactory({
    component: CourseComponent,
    declarations: [
      MockComponent(SectionLessonsComponent),
      MockComponent(TopbarComponent),
      MockComponent(CourseSidebarComponent),
      MockComponent(CourseContentComponent),
      MockComponent(SpinnerComponent),
    ],
    imports: [RouterTestingModule],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ [selectedSectionIdRouteParam]: '1' }),
        },
      },
      mockProvider(CourseFacadeService, {
        getCourseCustomStyling: jest.fn(() => of('')),
      }),
      mockProvider(CourseClientFacade, {
        courseId$: of('1'),
        sections$: of([
          {
            id: '1',
            name: 'Week 1',
            lessons: [
              {
                id: '1',
                title: '1. First lesson',
                description: 'This is the first lesson',
              },
              {
                id: '2',
                title: '2. Second lesson',
                description: 'This is the second lesson',
              },
            ],
          },
        ]),
      }),
    ],
    mocks: [],
  });

  beforeEach(() => {
    spectator = createComponent();
    courseFacadeService = spectator.inject(CourseClientFacade);
  });

  it('should get course sections', (done) => {
    spectator.component.sections$.pipe(first()).subscribe((sections) => {
      const expectedSections = [
        {
          id: '1',
          name: 'Week 1',
          lessons: [
            {
              id: '1',
              title: '1. First lesson',
              description: 'This is the first lesson',
            },
            {
              id: '2',
              title: '2. Second lesson',
              description: 'This is the second lesson',
            },
          ],
        },
      ];
      expect(sections).toEqual(expectedSections);
      done();
    });
  });
});
