import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CourseFacadeService } from '@course-platform/course-client-lib';
import { Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseContentComponent implements OnInit {
  public lesson$: Observable<Lesson>;
  public videoUrl$: Observable<SafeResourceUrl>;
  private placeholderUrl =
    'https://player.vimeo.com/video/38772314?title=0&byline=0&portrait=0';

  constructor(
    private sanitizer: DomSanitizer,
    private courseFacadeService: CourseFacadeService
  ) {}

  ngOnInit(): void {
    this.lesson$ = this.courseFacadeService.selectedLesson$;
    this.videoUrl$ = this.courseFacadeService.selectedLesson$.pipe(
      filter(lesson => !!lesson),
      map(lesson =>
        this.sanitizer.bypassSecurityTrustResourceUrl(
          lesson.videoUrl
            ? lesson.videoUrl + '?title=0&byline=0&portrait=0'
            : this.placeholderUrl
        )
      )
    );
  }

  onCompletedLessonClick(isCompleted: boolean, lessonId: string) {
    this.courseFacadeService.lessonCompleted({ isCompleted, lessonId });
  }
}
