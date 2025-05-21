import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStationRentalHistoryComponent } from './charging-station-rental-history.component';

describe('ChargingStationRentalHistoryComponent', () => {
  let component: ChargingStationRentalHistoryComponent;
  let fixture: ComponentFixture<ChargingStationRentalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargingStationRentalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargingStationRentalHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
