import { TestBed } from '@angular/core/testing';

import { TopicsApiService } from './topics-api.service';

describe('TopicsApiService', () => {
  let service: TopicsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
