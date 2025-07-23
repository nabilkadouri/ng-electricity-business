import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeslotRequestInterface, TimeslotsResponseInterface } from '../../models/TimeslotsInterface';

@Injectable({
  providedIn: 'root'
})
export class TimeslotService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createMultipleTimeslots(timeslots: TimeslotRequestInterface[]): Observable<TimeslotsResponseInterface[]> {
    return this.http.post<TimeslotsResponseInterface[]>(`${this.apiUrl}/api/timeslots/batch`, timeslots);
  }

  deleteTimeslot(timeslotId: number):Observable<void> {
    
    return this.http.delete<void>(`${this.apiUrl}/api/timeslots/${timeslotId}`);
  }
}
