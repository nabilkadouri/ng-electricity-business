import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { SectionEtapesComponent } from './sections/section-etapes/section-etapes.component';
import { SectionServicesComponent } from './sections/section-services/section-services.component';
import { SectionSimulatorComponent } from './sections/section-simulator/section-simulator.component';
import { SectionTestimonialComponent } from './sections/section-testimonial/section-testimonial.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent,SectionEtapesComponent,SectionServicesComponent,SectionSimulatorComponent,SectionTestimonialComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
