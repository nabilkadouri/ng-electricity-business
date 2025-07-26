import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeVehicleComponent } from './recharge-vehicle.component';

describe('RechargeVehicleComponent', () => {
  let component: RechargeVehicleComponent;
  let fixture: ComponentFixture<RechargeVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RechargeVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechargeVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
