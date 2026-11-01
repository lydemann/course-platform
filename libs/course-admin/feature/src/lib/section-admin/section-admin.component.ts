import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin/shared/domain';
import { CourseSection } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-section-admin',
  templateUrl: './section-admin.component.html',
  styleUrls: ['./section-admin.component.scss'],
  standalone: false,
})
export class SectionAdminComponent {
  section$: Observable<CourseSection>;
  section!: Signal<CourseSection | undefined>;
  formGroup!: Signal<UntypedFormGroup | undefined>;
  formGroup$: Observable<UntypedFormGroup>;

  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.section$ = this.courseAdminFacade.currentSection$;
    this.formGroup$ = this.section$.pipe(
      filter((section) => !!section),
      map((section) => {
        return this.formBuilder.group({
          name: [section.name, Validators.required],
          theme: [section.theme],
        });
      }),
    );
    this.section = toSignal(this.section$);
    this.formGroup = toSignal(this.formGroup$);
  }

  goBack() {
    this.courseAdminFacade.goToCourseAdmin();
  }

  submit(formGroup: UntypedFormGroup, sectionId: string) {
    this.courseAdminFacade.updateSectionSubmitted({
      id: sectionId,
      ...formGroup.value,
    } as CourseSection);
  }

  onDelete(sectionId: string) {
    this.courseAdminFacade.deleteSectionSubmitted(sectionId);
  }
}
