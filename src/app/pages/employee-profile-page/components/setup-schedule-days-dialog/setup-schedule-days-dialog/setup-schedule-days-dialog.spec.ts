import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupScheduleDaysDialog } from './setup-schedule-days-dialog';

describe('SetupScheduleDaysDialog', () => {
  let component: SetupScheduleDaysDialog;
  let fixture: ComponentFixture<SetupScheduleDaysDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupScheduleDaysDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupScheduleDaysDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
