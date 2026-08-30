import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CopilotSidebar, connectAgentContext } from '@copilotkit/angular';
import { CourseClientFacade } from '@course-platform/course-client/shared/domain';
import { AuthService } from '@course-platform/shared/auth/domain';

/**
 * Floating course assistant.
 *
 * Mount it once inside the course shell. It feeds the student's current
 * location in the course to the agent as AG-UI context, so "what is this
 * section about?" resolves without the student repeating themselves and without
 * the model spending a tool call to find out where they are.
 */
@Component({
  selector: 'app-course-assistant',
  imports: [CopilotSidebar],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isBrowser() && isAuthenticated()) {
      <copilot-sidebar
        [(open)]="open"
        mode="overlay"
        position="right"
        title="Course assistant"
      />
    }
  `,
})
export class CourseAssistantComponent {
  /**
   * The sidebar owns focus trapping, an iframe-free overlay and a launcher
   * button — all browser-only. Rendering nothing on the server and on the first
   * client pass keeps hydration matched.
   */
  protected readonly isBrowser = signal(false);

  /**
   * The sidebar hits the runtime as soon as it mounts, and the runtime rejects
   * anything without the Supabase JWT. That header is set from the auth state
   * callback, which resolves asynchronously — so mounting eagerly raced it and
   * every request 401'd while tRPC, firing later, succeeded with the same token.
   * `currentUser$` emits only after that callback has run, so gating on it means
   * the header is always in place before the first request.
   */
  protected readonly isAuthenticated = toSignal(
    inject(AuthService).currentUser$.pipe(map((user) => !!user)),
    { initialValue: false },
  );
  protected readonly open = signal(false);

  private readonly courseId = toSignal(this.courseClientFacade.courseId$, {
    initialValue: undefined,
  });
  private readonly selectedSection = toSignal(
    this.courseClientFacade.selectedSection$,
    { initialValue: undefined },
  );
  private readonly selectedLessonId = toSignal(
    this.courseClientFacade.selectedLessonId$,
    { initialValue: undefined },
  );

  constructor(private courseClientFacade: CourseClientFacade) {
    afterNextRender(() => this.isBrowser.set(true));

    // Reactive accessor: re-sent whenever the student navigates.
    connectAgentContext(() => {
      const section = this.selectedSection();

      return {
        description:
          'Where the student currently is in the course UI. Use these ids when they say "this course", "this section" or "this lesson".',
        value: JSON.stringify({
          courseId: this.courseId() ?? null,
          sectionId: section?.id ?? null,
          sectionName: section?.name ?? null,
          lessonId: this.selectedLessonId() ?? null,
        }),
      };
    });
  }
}
