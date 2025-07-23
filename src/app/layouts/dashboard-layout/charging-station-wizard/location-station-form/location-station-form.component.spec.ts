import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationStationFormComponent } from './location-station-form.component';

describe('LocationStationFormComponent', () => {
  let component: LocationStationFormComponent;
  let fixture: ComponentFixture<LocationStationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationStationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationStationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
