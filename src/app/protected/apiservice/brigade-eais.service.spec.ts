import { TestBed } from '@angular/core/testing';

import { BrigadeEaisService } from './brigade-eais.service';

describe('BrigadeEaisService', () => {
  let service: BrigadeEaisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrigadeEaisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
