import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SelectComponent } from '@course-platform/shared/ui';

describe('SelectComponent with zoneless change detection', () => {
  it('updates the rendered disabled state when Angular forms changes it', async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations()],
    }).compileComponents();
    const fixture = TestBed.createComponent(SelectComponent);
    await fixture.whenStable();
    const select = fixture.nativeElement.querySelector('mat-select');
    expect(select.getAttribute('aria-disabled')).toBe('false');
    fixture.componentInstance.setDisabledState(true);
    await fixture.whenStable();
    expect(select.getAttribute('aria-disabled')).toBe('true');
    fixture.componentInstance.setDisabledState(false);
    await fixture.whenStable();
    expect(select.getAttribute('aria-disabled')).toBe('false');
  });
});

import { Component, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SelectOptionComponent } from '@course-platform/shared/ui';

@Component({
  imports: [SelectComponent, SelectOptionComponent],
  template: `<app-select
    ><app-select-option [value]="optionValue()"
      >Option</app-select-option
    ></app-select
  >`,
})
class SelectHostComponent {
  optionValue = signal('first');
}

describe('projected select options', () => {
  it('reflects changes to a projected option without Zone.js', async () => {
    await TestBed.configureTestingModule({
      imports: [SelectHostComponent],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations()],
    }).compileComponents();
    const fixture = TestBed.createComponent(SelectHostComponent);
    await fixture.whenStable();
    const select = fixture.debugElement.query(By.directive(SelectComponent))
      .componentInstance as SelectComponent;
    expect(select.options()[0].value).toBe('first');
    fixture.componentInstance.optionValue.set('second');
    await fixture.whenStable();
    expect(select.options()[0].value).toBe('second');
  });
});

import { TextareaComponent } from '@course-platform/shared/ui';
import { TextareaModule } from '@course-platform/shared/ui';

describe('TextareaComponent with zoneless change detection', () => {
  it('renders values and disabled changes written by a form', async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaModule],
      providers: [provideZonelessChangeDetection(), provideNoopAnimations()],
    }).compileComponents();
    const fixture = TestBed.createComponent(TextareaComponent);
    await fixture.whenStable();
    const textarea: HTMLTextAreaElement =
      fixture.nativeElement.querySelector('textarea');
    fixture.componentInstance.writeValue('Hello');
    fixture.componentInstance.setDisabledState(true);
    await fixture.whenStable();
    expect(textarea.value).toBe('Hello');
    expect(textarea.disabled).toBe(true);
    fixture.componentInstance.writeValue('');
    fixture.componentInstance.setDisabledState(false);
    await fixture.whenStable();
    expect(textarea.value).toBe('');
    expect(textarea.disabled).toBe(false);
  });
});
