import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionEtapesComponent } from './section-etapes.component';

describe('SectionEtapesComponent', () => {
  let component: SectionEtapesComponent;
  let fixture: ComponentFixture<SectionEtapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionEtapesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionEtapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
