import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChargingStationsComponent } from './user-charging-stations.component';

describe('UserChargingStationsComponent', () => {
  let component: UserChargingStationsComponent;
  let fixture: ComponentFixture<UserChargingStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserChargingStationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChargingStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
