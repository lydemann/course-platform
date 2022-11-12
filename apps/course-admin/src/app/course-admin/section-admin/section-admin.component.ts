import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { CourseAdminFacadeService } from '@course-platform/course-admin-lib';
import { CourseSection } from '@course-platform/shared/interfaces';

@Component({
  selector: 'app-section-admin',
  templateUrl: './section-admin.component.html',
  styleUrls: ['./section-admin.component.scss'],
})
export class SectionAdminComponent implements OnInit {
  section$: Observable<CourseSection>;
  formGroup$: Observable<UntypedFormGroup>;

  constructor(
    private courseAdminFacade: CourseAdminFacadeService,
    private formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit() {
    this.section$ = this.courseAdminFacade.currentSection$;
    this.formGroup$ = this.section$.pipe(
      filter((section) => !!section),
      map((section) => {
        return this.formBuilder.group({
          name: [section.name, Validators.required],
          theme: [section.theme],
        });
      })
    );
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
