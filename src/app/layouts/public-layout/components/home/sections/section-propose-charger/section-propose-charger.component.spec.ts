import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionProposeChargerComponent } from './section-propose-charger.component';

describe('SectionProposeChargerComponent', () => {
  let component: SectionProposeChargerComponent;
  let fixture: ComponentFixture<SectionProposeChargerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionProposeChargerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionProposeChargerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
