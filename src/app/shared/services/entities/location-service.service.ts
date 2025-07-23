import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationStationRequestInterface, LocationStationResponseInterface } from '../../models/LocationStationInterface';


@Injectable({
  providedIn: 'root'
})
export class LocationServiceService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createLocationStation(locationData: LocationStationRequestInterface): Observable<LocationStationResponseInterface> {
    return this.http.post<LocationStationResponseInterface>(`${this.apiUrl}/api/location_stations`, locationData);
  }

  getAllLocationStations(): Observable<LocationStationResponseInterface[]> {
    return this.http.get<LocationStationResponseInterface[]>(`${this.apiUrl}/api/location_stations`);
  }

  getLocationStationById(id: number): Observable<LocationStationResponseInterface> {
    return this.http.get<LocationStationResponseInterface>(`${this.apiUrl}/api/location_stations/${id}`);
  }

  

  deleteLocationStation(id: number): Observable<LocationStationResponseInterface> {
    return this.http.delete<LocationStationResponseInterface>(`${this.apiUrl}/api/location_stations/${id}`);
  }

}
