import { TestBed } from '@angular/core/testing';

import { InfoEaisService } from './info-eais.service';

describe('InfoEaisService', () => {
  let service: InfoEaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoEaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
