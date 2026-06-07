import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockInClockOut } from './clock-in-clock-out';

describe('ClockInClockOut', () => {
  let component: ClockInClockOut;
  let fixture: ComponentFixture<ClockInClockOut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockInClockOut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClockInClockOut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
