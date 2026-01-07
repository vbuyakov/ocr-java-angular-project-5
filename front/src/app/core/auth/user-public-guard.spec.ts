import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userPublicGuard } from './user-public-guard';

describe('userPublicGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userPublicGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
