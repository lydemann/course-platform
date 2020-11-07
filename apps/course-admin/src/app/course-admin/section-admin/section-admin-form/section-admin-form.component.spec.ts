/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SectionAdminFormComponent } from './section-admin-form.component';

describe('SectionAdminFormComponent', () => {
  let component: SectionAdminFormComponent;
  let fixture: ComponentFixture<SectionAdminFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SectionAdminFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
