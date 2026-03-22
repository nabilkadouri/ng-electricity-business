import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BookingRequestInterface,
  BookingResponseInterface,
  BookingStatus,
} from '../../models/BookingInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  readonly apiURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createBooking(
    bookingRequest: BookingRequestInterface,
  ): Observable<BookingResponseInterface> {
    return this.http.post<BookingResponseInterface>(
      `${this.apiURL}/api/bookings`,
      bookingRequest,
    );
  }

  updateBookingStatus(
    bookingId: number,
    newStatus: BookingStatus,
    cancelReason?: string,
  ): Observable<BookingResponseInterface> {
    const url = `${this.apiURL}/api/bookings/${bookingId}/status`;

    const body: any = { status: newStatus };
    if (cancelReason) {
      body.cancelReason = cancelReason;
    }

    return this.http.patch<BookingResponseInterface>(url, body);
  }
}
