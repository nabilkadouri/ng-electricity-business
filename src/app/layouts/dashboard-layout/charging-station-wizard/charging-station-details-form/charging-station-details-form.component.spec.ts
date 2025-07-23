import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStationDetailsFormComponent } from './charging-station-details-form.component';

describe('ChargingStationDetailsFormComponent', () => {
  let component: ChargingStationDetailsFormComponent;
  let fixture: ComponentFixture<ChargingStationDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargingStationDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargingStationDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
