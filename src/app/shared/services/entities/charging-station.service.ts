import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ChargingStationInterface } from '../../models/ChargingStationInterface';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../models/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ChargingStationService {
  readonly apiURL = environment.apiUrl;
  public chargingStation = signal<ChargingStationInterface[]>([]);

  constructor(private http:HttpClient) { }

  getChargingStationByUser():Observable<ChargingStationInterface[]> {
return this.http.get<ChargingStationInterface[]>(`${this.apiURL}/api/charging_stations`)
  }
}
