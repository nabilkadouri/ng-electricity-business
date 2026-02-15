import { Component, inject, OnInit } from '@angular/core';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChargingStationResponseInterface } from '../../../../shared/models/ChargingStationInterface';
import { UserService } from '../../../../shared/services/entities/user.service';
import { UserResponseInterface } from '../../../../shared/models/UserInterface';

@Component({
  selector: 'app-my-charging-stations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-charging-stations.component.html',
  styleUrl: './my-charging-stations.component.css'
})
export class MyChargingStationsComponent implements OnInit {

  chargingStationService = inject(ChargingStationService);
  userService = inject(UserService);

  user!: UserResponseInterface;

  ownedStations: (ChargingStationResponseInterface & {
    tempDescription?: string;
    ownerMode?: 'edit' | 'confirmed';
  })[] = [];
  

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.ownedStations = user.chargingStations.map(station => ({
          ...station,
          tempDescription: '',
          ownerMode: station.isAvailable ? undefined : 'confirmed'
        }));        
      }
    });
  }

  // Toggle switch
  onToggleAvailability(station: any): void {

    const newStatus = !station.isAvailable;
  
    // Si on remet disponible
    if (newStatus) {
      this.chargingStationService.updateOwnerSettings(
        station.id!,
        { isAvailable: true }
      ).subscribe(updated => {
        station.isAvailable = true;
        station.ownerMode = undefined;
        station.unavailabilityReason = null;
      });
      return;
    }
  
    // Si on passe en indisponible
    station.isAvailable = false;
    station.ownerMode = 'edit';
  }
  
  

  // Confirmation indisponibilité
  saveOwnerSettings(station: any): void {

    if (!station.tempDescription?.trim()) {
      alert("Veuillez ajouter un motif d'indisponibilité.");
      return;
    }
  
    this.chargingStationService.updateOwnerSettings(
      station.id!,
      {
        isAvailable: false,
        unavailabilityReason: station.tempDescription
      }
    ).subscribe({
      next: (updated) => {
        station.unavailabilityReason = updated.unavailabilityReason;
        station.ownerMode = 'confirmed';
        station.tempDescription = '';
      },
      error: () => {
        alert("Erreur lors de la mise à jour.");
      }
    });
  }
  
  
  
  deleteStation(stationId: number): void {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette borne ?")) {
      this.chargingStationService.deleteChargingStation(stationId)
        .subscribe(() => {
          this.ownedStations =
            this.ownedStations.filter(s => s.id !== stationId);
        });
    }
  }
}
