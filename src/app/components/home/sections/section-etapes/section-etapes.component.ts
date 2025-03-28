import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { LIST_ETAPES } from '../../../../shared/data';


@Component({
  selector: 'app-section-etapes',
  imports: [CommonModule],
  templateUrl: './section-etapes.component.html',
  styleUrl: './section-etapes.component.css'
})
export class SectionEtapesComponent {
  etapes = LIST_ETAPES;
}
