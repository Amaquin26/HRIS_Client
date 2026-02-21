import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProfilePage } from './employee-profile-page';

describe('EmployeeProfilePage', () => {
  let component: EmployeeProfilePage;
  let fixture: ComponentFixture<EmployeeProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeProfilePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeProfilePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
