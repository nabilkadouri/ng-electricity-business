import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargingStationWizardComponent } from './charging-station-wizard.component';

describe('ChargingStationWizardComponent', () => {
  let component: ChargingStationWizardComponent;
  let fixture: ComponentFixture<ChargingStationWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargingStationWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargingStationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
