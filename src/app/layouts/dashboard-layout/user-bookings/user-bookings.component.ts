import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { CommonModule } from '@angular/common';
import { BookingResponseInterface } from '../../../shared/models/BookingInterface';

@Component({
  selector: 'app-user-bookings',
  imports: [CommonModule],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent implements OnInit {
  private userService = inject(UserService);
  currentBookings: BookingResponseInterface[] = [];

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.currentBookings = user.bookings;
      }
    })
  }

}
