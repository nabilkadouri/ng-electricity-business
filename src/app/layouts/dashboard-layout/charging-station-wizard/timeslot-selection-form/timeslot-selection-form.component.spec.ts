import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeslotSelectionFormComponent } from './timeslot-selection-form.component';

describe('TimeslotSelectionFormComponent', () => {
  let component: TimeslotSelectionFormComponent;
  let fixture: ComponentFixture<TimeslotSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeslotSelectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeslotSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
