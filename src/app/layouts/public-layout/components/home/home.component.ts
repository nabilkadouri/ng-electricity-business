import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';

import { SectionSimulatorComponent } from './sections/section-simulator/section-simulator.component';
import { SectionTestimonialComponent } from './sections/section-testimonial/section-testimonial.component';
import { SectionProposeChargerComponent } from "./sections/section-propose-charger/section-propose-charger.component";
import { SectionSimpleProcessComponent } from "./sections/section-simple-process/section-simple-process.component";
import { MapsComponent } from "./sections/maps/maps.component";

@Component({
  selector: 'app-home',
  imports: [HeroComponent, SectionSimulatorComponent, SectionTestimonialComponent, SectionProposeChargerComponent, SectionSimpleProcessComponent, MapsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
