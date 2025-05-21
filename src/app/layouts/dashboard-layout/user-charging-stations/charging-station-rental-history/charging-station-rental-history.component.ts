import { Component, inject, OnInit } from '@angular/core';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { ChargingStationInterface } from '../../../../shared/models/ChargingStationInterface';
import { CommonModule } from '@angular/common';
import { FlattenedBooking } from '../../../../shared/models/BookingInterface';

@Component({
  selector: 'app-charging-station-rental-history',
  imports: [CommonModule],
  templateUrl: './charging-station-rental-history.component.html',
  styleUrl: './charging-station-rental-history.component.css'
})
export class ChargingStationRentalHistoryComponent implements OnInit{
  chargingStationService = inject(ChargingStationService);
  ownedStations: ChargingStationInterface[] = [];
  allBookings: FlattenedBooking[] = []; 

  ngOnInit(): void {
    this.chargingStationDataByUser();
  }

  chargingStationDataByUser(): void {
    this.chargingStationService.getChargingStationByUser().subscribe(
      (data) => {
        this.ownedStations = data;
        console.log('Bornes possédées:', this.ownedStations);
        // Une fois les bornes chargées, nous aplatissons les réservations
        this.flattenBookings();
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des bornes de l'utilisateur",
          error,
        );
      },
    );
  }

  // Nouvelle méthode pour aplatir le tableau des réservations
  private flattenBookings(): void {
    this.allBookings = []; // Réinitialiser le tableau pour éviter les doublons si la méthode est appelée plusieurs fois

    this.ownedStations.forEach(station => {
      station.bookings.forEach(booking => {
        this.allBookings.push({
          ...booking, // Copie toutes les propriétés de la réservation
          stationName: station.nameStation // Ajoute le nom de la borne
        });
      });
    });

    // Optionnel: Trier les réservations, par exemple par date de création de la réservation
    this.allBookings.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());

    console.log('Toutes les réservations aplaties:', this.allBookings);
  }

}
