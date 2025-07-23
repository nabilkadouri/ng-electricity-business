import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingResponseInterface, BookingStatus } from '../../models/BookingInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  readonly apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  updateBookingStatus(bookingId: number, newStatus: BookingStatus): Observable<BookingResponseInterface> {
    const url = `${this.apiURL}/api/bookings/${bookingId}`;
    const body = { status: newStatus };
    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json', 
      'Accept': 'application/ld+json' 
    });

    return this.http.patch<BookingResponseInterface>(url, body, { headers: headers });
  }

}
