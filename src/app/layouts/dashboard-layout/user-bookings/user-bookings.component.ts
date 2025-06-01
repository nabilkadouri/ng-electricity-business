import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { BookingInterface } from '../../../shared/models/BookingInterface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  imports: [CommonModule],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent implements OnInit {
  private userService = inject(UserService);
  currentBookings: BookingInterface[] = [];

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.currentBookings = user.bookings;
      }
    })
  }

}
