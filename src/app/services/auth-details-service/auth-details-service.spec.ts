import { TestBed } from '@angular/core/testing';

import { AuthDetailsService } from './auth-details-service';

describe('AuthDetailsService', () => {
  let service: AuthDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
