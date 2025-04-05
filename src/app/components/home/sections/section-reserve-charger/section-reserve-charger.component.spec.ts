import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionReserveChargerComponent } from './section-reserve-charger.component';

describe('SectionReserveChargerComponent', () => {
  let component: SectionReserveChargerComponent;
  let fixture: ComponentFixture<SectionReserveChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionReserveChargerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionReserveChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
