import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntraUsersPage } from './entra-users-page';

describe('EntraUsers', () => {
  let component: EntraUsersPage;
  let fixture: ComponentFixture<EntraUsersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntraUsersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntraUsersPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
