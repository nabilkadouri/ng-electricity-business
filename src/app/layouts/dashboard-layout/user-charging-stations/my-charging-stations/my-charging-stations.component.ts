import { Component, inject, OnInit } from '@angular/core';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { ChargingStationInterface } from '../../../../shared/models/ChargingStationInterface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-charging-stations',
  imports: [CommonModule],
  templateUrl: './my-charging-stations.component.html',
  styleUrl: './my-charging-stations.component.css'
})
export class MyChargingStationsComponent implements OnInit{
  chargingStationService = inject(ChargingStationService);
  ownedStations: ChargingStationInterface[] = [];

  ngOnInit(): void {
    this.chargingStationDataByUser();
  }

  chargingStationDataByUser(): void {
    this.chargingStationService.getChargingStationByUser().subscribe(
      (data) => {
        this.ownedStations = data;
        console.log('Bornes possédées:', this.ownedStations);
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des bornes de l'utilisateur",
          error,
        );
      },
    );
  }

}
