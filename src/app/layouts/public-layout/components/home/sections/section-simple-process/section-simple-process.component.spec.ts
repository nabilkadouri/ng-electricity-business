import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSimpleProcessComponent } from './section-simple-process.component';

describe('SectionSimpleProcessComponent', () => {
  let component: SectionSimpleProcessComponent;
  let fixture: ComponentFixture<SectionSimpleProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionSimpleProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionSimpleProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
