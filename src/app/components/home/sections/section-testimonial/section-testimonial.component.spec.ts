import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTestimonialComponent } from './section-testimonial.component';

describe('SectionTestimonialComponent', () => {
  let component: SectionTestimonialComponent;
  let fixture: ComponentFixture<SectionTestimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTestimonialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
