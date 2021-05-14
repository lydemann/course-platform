import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { CourseClientFacade } from '@course-platform/course-client-lib';
import { Lesson } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseContentComponent implements OnInit {
  public lesson$: Observable<Lesson>;
  public videoUrl$: Observable<SafeResourceUrl>;
  private placeholderUrl =
    'https://player.vimeo.com/video/38772314?title=0&byline=0&portrait=0';

  constructor(
    private sanitizer: DomSanitizer,
    private courseFacadeService: CourseClientFacade
  ) {}

  ngOnInit(): void {
    this.lesson$ = this.courseFacadeService.selectedLesson$;
    this.videoUrl$ = this.courseFacadeService.selectedLesson$.pipe(
      filter((lesson) => !!lesson),
      distinctUntilChanged((prev, cur) => prev?.videoUrl === cur?.videoUrl),
      map((lesson) =>
        this.getTrustedVideoUrl(
          lesson.videoUrl
            ? lesson.videoUrl + '?title=0&byline=0&portrait=0'
            : this.placeholderUrl
        )
      )
    );
  }

  private getTrustedVideoUrl(url: string): SafeResourceUrl {
    // Url domains are whitelisted using CSP header
    // Content-Security-Policy: frame-src <source> <source>;
    const sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
  }

  onCompletedLessonClick(isCompleted: boolean, lessonId: string) {
    this.courseFacadeService.lessonCompleted({ isCompleted, lessonId });
  }
}
