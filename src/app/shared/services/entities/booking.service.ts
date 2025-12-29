import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingRequestInterface, BookingResponseInterface, BookingStatus } from '../../models/BookingInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  readonly apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  updateBookingStatus(bookingId: number, newStatus: BookingStatus, cancelReason?: string): Observable<BookingResponseInterface> {
  
    const url = `${this.apiURL}/api/bookings/${bookingId}/status`;
  
    const body: any = { status: newStatus };
    if (cancelReason) {
      body.cancelReason = cancelReason;
    }
  
    return this.http.patch<BookingResponseInterface>(url, body);
  }
  

  createBooking(bookingRequest: BookingRequestInterface): Observable<BookingResponseInterface> {
    const url = `${this.apiURL}/api/bookings`;

    const authToken = localStorage.getItem('authToken');

    let headers = new HttpHeaders();
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    } else {
      console.error("Jeton d'authentification non trouvé.");
    }
    return this.http.post<BookingResponseInterface>(url, bookingRequest, { headers: headers });
  }



}
