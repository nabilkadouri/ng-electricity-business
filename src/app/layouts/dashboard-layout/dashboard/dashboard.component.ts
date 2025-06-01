import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { AuthServiceService } from '../../../shared/services/auth-service.service';
import { UserInterface } from '../../../shared/models/UserInterface';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { BookingInterface } from '../../../shared/models/BookingInterface';
import { ChargingStationInterface } from '../../../shared/models/ChargingStationInterface';
import { ChargingStationService } from '../../../shared/services/entities/charging-station.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthServiceService);
  chargingStationService = inject(ChargingStationService);
  user!: UserInterface;
  currentBookings: BookingInterface[] = [];
  ownedStations: ChargingStationInterface[] = [];

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.currentBookings = user.bookings;
      }
    })
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
