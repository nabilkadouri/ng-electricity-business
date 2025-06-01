import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BookingInterface, BookingStatus } from '../../models/BookingInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  readonly apiURL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  updateBookingStatus(bookingId: number, newStatus: BookingStatus): Observable<BookingInterface> {
    const url = `${this.apiURL}/api/bookings/${bookingId}`;
    const body = { status: newStatus };

    // Ajout de logs pour vérification (temporaire)
    console.log('Service: Sending PATCH request to:', url);
    console.log('Service: Request Body:', body);
    console.log('Service: New Status value being sent:', newStatus);

    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json', 
      'Accept': 'application/ld+json' 
    });

    return this.http.patch<BookingInterface>(url, body, { headers: headers });
  }

}
