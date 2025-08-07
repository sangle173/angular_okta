import { TestBed } from '@angular/core/testing';

import { VideoConverter } from './video-converter';

describe('VideoConverter', () => {
  let service: VideoConverter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoConverter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
