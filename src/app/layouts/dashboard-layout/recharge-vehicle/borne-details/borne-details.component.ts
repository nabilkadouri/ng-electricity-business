import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChargingStationResponseInterface } from '../../../../shared/models/ChargingStationInterface';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-borne-details',
  imports: [CommonModule],
  templateUrl: './borne-details.component.html',
  styleUrl: './borne-details.component.css'
})
export class BorneDetailsComponent implements OnInit{
chargingStation!: ChargingStationResponseInterface;
chargingStationService = inject(ChargingStationService);
route = inject(ActivatedRoute);


ngOnInit(): void {

  this.getChargingStationById();
    
}

getChargingStationById() {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.chargingStationService.getChargingStationById(+id).subscribe({
      next: (response) => {
        this.chargingStation = response;
        console.log('Borne récupérée :', this.chargingStation);
      },
      error: (err) => {
        console.error('Erreur lors du chargement de la borne', err);
      }
    });
  }
}


}
