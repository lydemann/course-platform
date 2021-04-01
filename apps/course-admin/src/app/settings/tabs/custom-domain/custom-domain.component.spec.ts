/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CustomDomainComponent } from './custom-domain.component';

describe('CustomDomainComponent', () => {
  let component: CustomDomainComponent;
  let fixture: ComponentFixture<CustomDomainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDomainComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
