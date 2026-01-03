import { Component, inject, OnInit } from '@angular/core';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { CommonModule } from '@angular/common';
import {
  BookingStatus,
  FlattenedBooking,
} from '../../../../shared/models/BookingInterface';
import { BookingService } from '../../../../shared/services/entities/booking.service';
import { FormsModule } from '@angular/forms';
import { ChargingStationResponseInterface } from '../../../../shared/models/ChargingStationInterface';
import { UserService } from '../../../../shared/services/entities/user.service';

@Component({
  selector: 'app-charging-station-rental-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './charging-station-rental-history.component.html',
  styleUrl: './charging-station-rental-history.component.css',
})
export class ChargingStationRentalHistoryComponent {
  
  chargingStationService = inject(ChargingStationService);
  userService = inject(UserService);
  bookingService = inject(BookingService);
  BookingStatus = BookingStatus;

  ownedStations: ChargingStationResponseInterface[] = [];
  allBookings: FlattenedBooking[] = [];

  // Crée un tableau qui contient toutes les valeurs des différents statuts de réservation
  availableBookingStatuses: BookingStatus[] = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.CANCELLED,
  ];

  ngOnInit(): void {
    this.chargingStationDataByUser();
  }

  chargingStationDataByUser(): void {
    this.userService.getConnectedUserFromApi().subscribe({
      next: (data) => {
        this.ownedStations = data.chargingStations;
        // Une fois les bornes chargées, nous aplatissons les réservations
        this.flattenBookings();
      },
      error: (error) => {
        console.error(
          "Erreur lors de la récupération des bornes de l'utilisateur",
          error,
        );
      },
    });
  }

  /**
   * Nouvelle méthode pour aplatir le tableau des réservations
   */
  private flattenBookings(): void {
    this.allBookings = []; // Réinitialiser le tableau pour éviter les doublons si la méthode est appelée plusieurs fois

    this.ownedStations.forEach((station) => {
      station.bookings.forEach((booking) => {
        this.allBookings.push({
          ...booking,
          // Copie toutes les propriétés de la réservation
          stationName: station.nameStation, // Ajoute le nom de la borne
        });
      });
    });

    // Trier les réservations par date de création de la réservation
    this.allBookings.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  /**
   * Méthode qui permet de modifier le status de la réservation
   * @param booking La réservation dont le status est modifié
   * @param event l'événment de changement du sélécteur HTML
   */
  onStatusChange(booking: FlattenedBooking, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value as BookingStatus;
  
    if (newStatus === BookingStatus.CANCELLED) {
      const reason = prompt("Indiquez le motif de l'annulation :");
  
      if (!reason || reason.trim().length < 3) {
        alert("Vous devez fournir un motif d'annulation.");
        return;
      }
  
      this.sendStatusUpdate(booking, newStatus, reason);
    }
    else {
      this.sendStatusUpdate(booking, newStatus);
    }
  }

  private sendStatusUpdate(booking: FlattenedBooking, newStatus: BookingStatus,cancelReason?: string) {
    if (!booking.id) {
      console.error("Impossible de mettre à jour : ID manquant");
      return;
    }
  
    this.bookingService.updateBookingStatus(booking.id, newStatus, cancelReason)
      .subscribe({
        next: (updated) => {
  
          booking.status = updated.status;
  
          this.chargingStationDataByUser(); 
        },
        error: (error) => {
          console.error("Erreur mise à jour statut", error);
        }
      });
  }
}
