import { Component, inject, OnInit } from '@angular/core';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { CommonModule } from '@angular/common';
import { TimeslotService } from '../../../../shared/services/entities/timeslot.service';
import { forkJoin, of, switchMap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ChargingStationResponseInterface } from '../../../../shared/models/ChargingStationInterface';
import { UserService } from '../../../../shared/services/entities/user.service';
import { UserResponseInterface } from '../../../../shared/models/UserInterface';

@Component({
  selector: 'app-my-charging-stations',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './my-charging-stations.component.html',
  styleUrl: './my-charging-stations.component.css'
})
export class MyChargingStationsComponent implements OnInit{
  chargingStationService = inject(ChargingStationService);
  userService = inject(UserService);
  user!: UserResponseInterface;
  ownedStations: ChargingStationResponseInterface[] = [];

  ngOnInit(): void {
    this.userService.user$.subscribe((user)=> {
      if(user){
        this.ownedStations = user?.chargingStations;
      } else {
        console.error(
          "Erreur lors de la récupération des données utilisateur : L'objet utilisateur est null."
        );
      } 
    })
   
  }

  // chargingStationDataByUser(): void {
  //   this.chargingStationService.getChargingStationByUser().subscribe(
  //     (data) => {
  //       this.ownedStations = data;
  //       console.log('Bornes possédées:', this.ownedStations);
  //     },
  //     (error) => {
  //       console.error(
  //         "Erreur lors de la récupération des bornes de l'utilisateur",
  //         error,
  //       );
  //     },
  //   );
  // }

  deleteStation(stationId: number): void {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer cette borne ?")
    ){
      this.chargingStationService.deleteChargingStation(stationId)
      .subscribe({
        next: () => {
          console.log(`Borne (ID: ${stationId}) et ses timeslots supprimés avec succès.`);
          this.ownedStations = this.ownedStations.filter(station => station.id != stationId);
        },
        error: (error) => {
          console.error(`Erreur lors de la suppression de la borne (ID: ${stationId}):`, error);
          alert("Une erreur est survenue lors de la suppression de la borne.");
        },
      });
    }
  }

  
}
