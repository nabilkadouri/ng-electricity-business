import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChargingStationsComponent } from './my-charging-stations.component';

describe('MyChargingStationsComponent', () => {
  let component: MyChargingStationsComponent;
  let fixture: ComponentFixture<MyChargingStationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyChargingStationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyChargingStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
