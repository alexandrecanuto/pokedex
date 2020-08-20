import { TestBed } from '@angular/core/testing';

import { GenerationService } from './generations.service';

describe('GenerationService', () => {
  let service: GenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
