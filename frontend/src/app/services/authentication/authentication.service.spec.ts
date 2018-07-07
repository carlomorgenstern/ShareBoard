// tslint:disable-next-line:no-implicit-dependencies
import {} from 'jasmine';

import { inject, TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service = TestBed.get(AuthenticationService) as AuthenticationService;
    expect(service).toBeTruthy();
  });
});
