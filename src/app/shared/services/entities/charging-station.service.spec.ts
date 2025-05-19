import { TestBed } from '@angular/core/testing';

import { ChargingStationService } from './charging-station.service';

describe('ChargingStationService', () => {
  let service: ChargingStationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargingStationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
