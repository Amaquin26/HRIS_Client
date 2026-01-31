import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntraUsers } from './entra-users';

describe('EntraUsers', () => {
  let component: EntraUsers;
  let fixture: ComponentFixture<EntraUsers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntraUsers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntraUsers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
