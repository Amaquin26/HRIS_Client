import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccountPage } from './no-account-page';

describe('NoAccountPage', () => {
  let component: NoAccountPage;
  let fixture: ComponentFixture<NoAccountPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoAccountPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAccountPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
