import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSimulatorComponent } from './section-simulator.component';

describe('SectionSimulatorComponent', () => {
  let component: SectionSimulatorComponent;
  let fixture: ComponentFixture<SectionSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSimulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
