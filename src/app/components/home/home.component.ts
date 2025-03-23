import { Component } from '@angular/core';
import { HeroComponent } from './sections/hero/hero.component';
import { SectionEtapesComponent } from './sections/section-etapes/section-etapes.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent,SectionEtapesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
