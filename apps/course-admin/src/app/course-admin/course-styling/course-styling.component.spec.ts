import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseStylingComponent } from './course-styling.component';

describe('CourseStylingComponent', () => {
  let component: CourseStylingComponent;
  let fixture: ComponentFixture<CourseStylingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseStylingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseStylingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
