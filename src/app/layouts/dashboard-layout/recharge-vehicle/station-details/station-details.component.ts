import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargingStationResponseInterface } from '../../../../shared/models/ChargingStationInterface';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BookingRequestInterface,
  BookingResponseInterface,
  HourlySlotInterface,
  PaymentMethod,
} from '../../../../shared/models/BookingInterface';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { BookingService } from '../../../../shared/services/entities/booking.service';
import { UserService } from '../../../../shared/services/entities/user.service';


@Component({
  selector: 'app-station-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './station-details.component.html',
  styleUrl: './station-details.component.css',
})
export class StationDetailsComponent implements OnInit {
  chargingStationService = inject(ChargingStationService);
  bookingService = inject(BookingService);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  chargingStation!: ChargingStationResponseInterface;

  noSlotsAvailable: boolean = false;
  selectedDateCalendar: Date | null = null;
  bookingsOfSelectedDay: BookingResponseInterface[] = [];
  slots: HourlySlotInterface[] = [];

  selectedStartTime: string | null = null;
  selectedEndTime: string | null = null;

  totalPrice: number = 0;
  bookingDurationHours: number = 0;
  readonly BOOKING_FEE_PERCENT: number = 2.5;

  showPaymentForm: boolean = false;
  paymentMethod: PaymentMethod | null = null;
  PaymentMethod = PaymentMethod;

  ngOnInit(): void {
    this.getChargingStationById();
  }

  // RECUPERATION BORNE
  getChargingStationById() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.chargingStationService.getChargingStationById(+id).subscribe({
        next: (response) => (this.chargingStation = response),
        error: (err) =>
          console.error('Erreur lors du chargement de la borne', err),
      });
    }
  }

  // GESTION DATE
  onDateChange(): void {
    if (!this.selectedDateCalendar) {
      this.slots = [];
      return;
    }

    const date = new Date(this.selectedDateCalendar);

    this.resetSelectionState();

    // Filtrage des réservations du jour
    this.bookingsOfSelectedDay = this.chargingStation.bookings.filter(
      (booking) => {
        const bookingStartDate = new Date(booking.startDate);
        return isWithinInterval(bookingStartDate, {
          start: startOfDay(date),
          end: endOfDay(date),
        });
      },
    );

    this.generateSlotsStation(date);
  }

  private resetSelectionState(): void {
    this.selectedStartTime = null;
    this.selectedEndTime = null;
    this.totalPrice = 0;
    this.bookingDurationHours = 0;
    this.showPaymentForm = false;
  }

  // GENERATION CRENEAUX
  generateSlotsStation(date: Date): void {
    this.slots = [];
    this.noSlotsAvailable = false;

    const selectedDay = date
      .toLocaleDateString('fr-FR', { weekday: 'long' })
      .toLowerCase();

    const timeslots = this.chargingStation.timeslots.filter(
      (slot) => slot.dayOfWeek.toLowerCase() === selectedDay,
    );

    if (!timeslots.length) {
      this.noSlotsAvailable = true;
      return;
    }

    timeslots.forEach((slot) => {
      let start = this.timeToMinutes(slot.startTime);
      const end = this.timeToMinutes(slot.endTime);

      while (start <= end) {
        const hour = Math.floor(start / 60);
        const minute = start % 60;

        const current = new Date(date);
        current.setHours(hour, minute);

        const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        this.slots.push({
          time: label,
          status: this.isSlotBooked(current) ? 'Indisponible' : 'Disponible',
        });

        start += 30;
      }
    });
  }

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private isSlotBooked(current: Date): boolean {
    return this.bookingsOfSelectedDay.some((booking) => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return start <= current && end > current;
    });
  }

  // SELECTION CRENEAUX
  toggleTime(time: string): void {
    const slot = this.slots.find((s) => s.time === time);
    if (!slot || slot.status === 'Indisponible') return;

    const [hour, minute] = time.split(':').map(Number);

    if (!this.selectedStartTime) {
      this.selectedStartTime = time;
      this.selectedEndTime = null;
      this.calculatePrice();
      return;
    }

    if (this.selectedStartTime === time && !this.selectedEndTime) {
      this.selectedStartTime = null;
      this.selectedEndTime = null;
      this.calculatePrice();
      return;
    }

    const [startH, startM] = this.selectedStartTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const clickedMinutes = hour * 60 + minute;

    if (clickedMinutes > startMinutes) {
      this.selectedEndTime = time;
      this.calculatePrice();
      return;
    }

    this.selectedStartTime = time;
    this.selectedEndTime = null;
    this.calculatePrice();
  }

  isSlotSelected(time: string): boolean {
    if (!this.selectedStartTime) return false;

    const minutes = this.timeToMinutes(time);
    const startMinutes = this.timeToMinutes(this.selectedStartTime);

    if (!this.selectedEndTime) {
      return minutes === startMinutes;
    }

    const endMinutes = this.timeToMinutes(this.selectedEndTime);
    return minutes >= startMinutes && minutes <= endMinutes;
  }

  // CALCUL TARIF
  calculatePrice(): void {
    if (!this.selectedStartTime || !this.selectedEndTime) {
      this.totalPrice = 0;
      return;
    }

    const durationHours =
      this.minutesBetween(this.selectedStartTime, this.selectedEndTime) / 60;

    const base = durationHours * this.chargingStation.pricePerHour;
    const fees = base * (this.BOOKING_FEE_PERCENT / 100);

    this.totalPrice = base + fees;
  }

  private minutesBetween(start: string, end: string): number {
    return this.timeToMinutes(end) - this.timeToMinutes(start);
  }

  // PAIEMENT & SOUMISSION
  showPaymentFormHandler(method: 'paypal' | 'card'): void {
    this.showPaymentForm = true;
    this.paymentMethod =
      method === 'paypal' ? PaymentMethod.PAYPAL : PaymentMethod.CB;
  }

  submitBooking(): void {
    const user = this.userService.getUserFromCache();

    if (
      !this.selectedStartTime ||
      !this.selectedEndTime ||
      !this.selectedDateCalendar ||
      !this.chargingStation ||
      !this.paymentMethod ||
      !user ||
      user.id === undefined
    ) {
      console.error('Erreur de validation ');
      return;
    }

    const selectedDate = new Date(this.selectedDateCalendar);

    const bookingRequest: BookingRequestInterface = {
      startDate: this.createDateFromTime(this.selectedStartTime, selectedDate),
      endDate: this.createDateFromTime(this.selectedEndTime, selectedDate),
      paymentType: this.paymentMethod,
      userId: user.id,
      chargingStationId: this.chargingStation.id,
    };

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: () => this.router.navigate(['/dashboard/bookings']),
      error: (err) => console.error('Erreur backend :', err),
    });
  }

  private createDateFromTime(time: string, date: Date): string {
    const [hours, minutes] = time.split(':').map(Number);
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);

    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0') +
      'T' +
      String(hours).padStart(2, '0') +
      ':' +
      String(minutes).padStart(2, '0') +
      ':00'
    );
  }
}
