import { Component, EventEmitter, Output, output } from '@angular/core';
import { PARTNERS } from '../../../../shared/data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-simulator',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './section-simulator.component.html',
  styleUrl: './section-simulator.component.css'
})
export class SectionSimulatorComponent {

  partenaires:any[] = PARTNERS;
  searchTerm = '';
  resultat:any[] = [];

  search(){
      this.resultat = this.partenaires.filter((prestataire)=>{
        return (prestataire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || prestataire.categorie.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        prestataire.services.some((service: string) => service.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
      })
}

}
