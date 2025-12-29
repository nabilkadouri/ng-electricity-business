import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChargingStationResponseInterface } from '../../../../shared/models/ChargingStationInterface';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingRequestInterface, BookingResponseInterface, HourlySlotInterface, PaymentMethod } from '../../../../shared/models/BookingInterface';
import { endOfDay, isWithinInterval, startOfDay } from 'date-fns';
import { BookingService } from '../../../../shared/services/entities/booking.service';
import { UserService } from '../../../../shared/services/entities/user.service';

@Component({
  selector: 'app-station-details',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './station-details.component.html',
  styleUrl: './station-details.component.css'
})
export class StationDetailsComponent implements OnInit {

 
  // SERVICES
  chargingStationService = inject(ChargingStationService);
  bookingService = inject(BookingService);
  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);


  


  // CALENDRIER & CRÉNEAUX
  noSlotsAvailable: boolean = false;
  selectedDateCalendar: Date | null = null;
  bookingsOfSelectedDay: BookingResponseInterface[] = [];
  slots: HourlySlotInterface[] = [];

  private lastGeneratedDate: string | null = null;

  // SÉLECTION DE CRÉNEAUX
  selectedStartTime: string | null = null;
  selectedEndTime: string | null = null;

  // CALCUL DU PRIX
  totalPrice: number = 0;
  bookingDurationHours: number = 0;
  readonly BOOKING_FEE_PERCENT: number = 2.5;

  // FORMULAIRE DE PAIEMENT
  showPaymentForm: boolean = false;
  paymentMethod: PaymentMethod | null = null;

  PaymentMethod = PaymentMethod;

  // DONNÉES DE LA BORNE
  chargingStation!: ChargingStationResponseInterface;

  // INITIALISATION
  ngOnInit(): void {
    this.getChargingStationById();
  }

  // RÉCUPÉRER LA BORNE
  getChargingStationById() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.chargingStationService.getChargingStationById(+id).subscribe({
        next: response => this.chargingStation = response,
        error: err => console.error('Erreur lors du chargement de la borne', err)
      });
    }
  }

  // CHANGEMENT DE DATE
  onDateChange(): void {
    console.warn("onDateChange déclenché");

    if (!this.selectedDateCalendar) {
      this.slots = [];
      return;
    }

    const date = new Date(this.selectedDateCalendar);

    this.selectedStartTime = null;
    this.selectedEndTime = null;
    this.totalPrice = 0;
    this.bookingDurationHours = 0;
    this.showPaymentForm = false;

    // Chargement des réservations du jour
    this.bookingsOfSelectedDay = this.chargingStation.bookings.filter(booking => {
      const bookingStartDate = new Date(booking.startDate);
      return isWithinInterval(bookingStartDate, {
        start: startOfDay(date),
        end: endOfDay(date)
      });
    });

    this.generateSlotsStation(date);
  }

  // GÉNÉRER LES CRÉNEAUX
  generateSlotsStation(date: Date): void {
    console.log("generateSlotsStation() — création des slots…");

    this.slots = [];
    this.noSlotsAvailable = false;

    const selectedDay = date.toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();

    const filteredSlots = this.chargingStation.timeslots.filter(slot =>
      slot.dayOfWeek.toLowerCase() === selectedDay
    );

    console.log("Timeslots du jour :", filteredSlots);

    if (filteredSlots.length === 0) {
      this.noSlotsAvailable = true;
      return;
    }

    filteredSlots.forEach(slot => {
      const startHour = parseInt(slot.startTime.slice(0, 2), 10);
      const startMinute = parseInt(slot.startTime.slice(3, 5), 10);

      const endHour = parseInt(slot.endTime.slice(0, 2), 10);
      const endMinute = parseInt(slot.endTime.slice(3, 5), 10);

      let hour = startHour;
      let minute = startMinute;

      while (hour < endHour || (hour === endHour && minute < endMinute)) {

        const label = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        const current = new Date(date);
        current.setHours(hour, minute);

        const isBooked = this.bookingsOfSelectedDay.some(booking => {
          const bookingStart = new Date(booking.startDate);
          const bookingEnd = new Date(booking.endDate);
          return bookingStart <= current && bookingEnd > current;
        });

        this.slots.push({
          time: label,
          status: isBooked ? "Indisponible" : "Disponible"
        });

        minute += 30;
        if (minute >= 60) {
          minute = 0;
          hour++;
        }
      }
    });

    if (this.slots.length === 0) this.noSlotsAvailable = true;
  }

  // SÉLECTIONNER UN CRÉNEAU
  toggleTime(time: string): void {
    const slot = this.slots.find(s => s.time === time);
    if (!slot || slot.status === 'Indisponible') return;

    const [hour, minute] = time.split(':').map(Number);

    // Aucun début sélectionné
    if (!this.selectedStartTime) {
      this.selectedStartTime = time;
      this.selectedEndTime = null;
      this.calculatePrice();
      return;
    }

    // Re-clic sur le début = reset
    if (this.selectedStartTime === time && !this.selectedEndTime) {
      this.selectedStartTime = null;
      this.selectedEndTime = null;
      this.calculatePrice();
      return;
    }

    // Début choisi = clique sur une fin
    const [startH, startM] = this.selectedStartTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const clickedMinutes = hour * 60 + minute;

    if (clickedMinutes > startMinutes) {
      this.selectedEndTime = time;
      this.calculatePrice();
      return;
    }

    // Clic avant = redéfinit début
    this.selectedStartTime = time;
    this.selectedEndTime = null;
    this.calculatePrice();
  }

  // STYLE DES CRÉNEAUX (sélectionnés)
  isSlotSelected(time: string): boolean {
    if (!this.selectedStartTime) return false;

    const [h, m] = time.split(':').map(Number);
    const minutes = h * 60 + m;

    const [startH, startM] = this.selectedStartTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;

    if (!this.selectedEndTime) {
      return minutes === startMinutes;
    }

    const [endH, endM] = this.selectedEndTime.split(':').map(Number);
    const endMinutes = endH * 60 + endM;

    return minutes >= startMinutes && minutes <= endMinutes;
  }

  // CALCULER LE PRIX
  calculatePrice(): void {
    if (!this.selectedStartTime || !this.selectedEndTime) {
      this.totalPrice = 0;
      this.bookingDurationHours = 0;
      return;
    }

    const [sh, sm] = this.selectedStartTime.split(':').map(Number);
    const [eh, em] = this.selectedEndTime.split(':').map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    const durationMinutes = end - start;
    this.bookingDurationHours = durationMinutes / 60;

    const basePrice = this.bookingDurationHours * this.chargingStation.pricePerHour;
    const fees = basePrice * (this.BOOKING_FEE_PERCENT / 100);

    this.totalPrice = basePrice + fees;
  }

  // AFFICHER FORMULAIRE DE PAIEMENT
  showPaymentFormHandler(method: 'paypal' | 'card'): void {
    this.showPaymentForm = true;
    this.paymentMethod = method === 'paypal' ? PaymentMethod.PAYPAL : PaymentMethod.CB;
  }

  // ENVOYER LA RÉSERVATION
  submitBooking(): void {
    const user = this.userService.getUserFromCache();

    if (!this.selectedStartTime || !this.selectedEndTime || !this.selectedDateCalendar ||
        !this.chargingStation || !this.paymentMethod || !user || user.id === undefined) {
      console.error('Erreur de validation front-end: Informations incomplètes.');
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
      next: (response) => {
        console.log('Réservation créée avec succès:', response);
  
        // ✅ REDIRECTION APRÈS VALIDATION
        this.router.navigate(['/dashboard/bookings']);
      },
      error: err => {
        console.error('Erreur reçue du backend :', err);
        console.error('Message d’erreur :', err.error?.message);
      }
    });
  }

  // CONSTRUIRE LA DATE COMPLÈTE (FRONT → BACK)
  private createDateFromTime(time: string, date: Date): string {
    const [hours, minutes] = time.split(':').map(Number);
    const d = new Date(date);

    d.setHours(hours, minutes, 0, 0);

    return (
      d.getFullYear() +
      "-" + String(d.getMonth() + 1).padStart(2, "0") +
      "-" + String(d.getDate()).padStart(2, "0") +
      "T" + String(hours).padStart(2, "0") +
      ":" + String(minutes).padStart(2, "0") +
      ":00"
    );
  }

}
