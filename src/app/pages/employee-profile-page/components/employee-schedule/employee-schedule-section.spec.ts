import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleSection } from './employee-schedule-section';

describe('EmployeeSchedule', () => {
  let component: EmployeeScheduleSection;
  let fixture: ComponentFixture<EmployeeScheduleSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeScheduleSection],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeScheduleSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
