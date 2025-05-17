import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LIST_ETAPES } from '../../../../../../shared/data';


@Component({
  selector: 'app-section-simple-process',
  imports: [CommonModule],
  templateUrl: './section-simple-process.component.html',
  styleUrl: './section-simple-process.component.css'
})
export class SectionSimpleProcessComponent {
etapes = LIST_ETAPES;
}
