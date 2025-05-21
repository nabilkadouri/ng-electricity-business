import { Component, inject, OnInit } from '@angular/core';
import { ChargingStationService } from '../../../shared/services/entities/charging-station.service';
import { UserService } from '../../../shared/services/entities/user.service';
import { BookingInterface } from '../../../shared/models/BookingInterface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css'
})
export class UserBookingsComponent implements OnInit {
  private userService = inject(UserService);
 currentBookings: BookingInterface[] = [];
  

  ngOnInit(): void {
    this.userData()
      
  }

  userData(): void {
    this.userService.getUser().subscribe((data) => {
      this.currentBookings = data.bookings;
      console.log('Historique réservation: ', this.currentBookings);
      
    });
  }

}
