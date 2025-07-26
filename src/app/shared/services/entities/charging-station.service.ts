import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {  ChargingStationRequestInterface, ChargingStationResponseInterface } from '../../models/ChargingStationInterface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {
  readonly apiUrl = environment.apiUrl;
  public chargingStation = signal<ChargingStationResponseInterface[]>([]);

  constructor(private http:HttpClient) { }

  getChargingStations():Observable<ChargingStationResponseInterface[]> {
    return this.http.get<ChargingStationResponseInterface[]>(`${this.apiUrl}/api/charging_stations`)
  }

  getChargingStationByUser():Observable<ChargingStationResponseInterface[]> {
return this.http.get<ChargingStationResponseInterface[]>(`${this.apiUrl}/api/users/me/charging_stations`)
  }

  postChargingStationByUser(data: ChargingStationRequestInterface):Observable<ChargingStationResponseInterface> {

    return this.http.post<ChargingStationResponseInterface>(`${this.apiUrl}/api/charging_stations`, data)
  }

  getChargingStationById(id: number): Observable<ChargingStationResponseInterface> {
    return this.http.get<ChargingStationResponseInterface>(`${this.apiUrl}/api/charging_stations/${id}`);
    }

  deleteChargingStation(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/api/charging_stations/${id}`);
  }
}
