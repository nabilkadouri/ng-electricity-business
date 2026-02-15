import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  ChargingStationOwnerUpdate,
  ChargingStationRequestInterface,
  ChargingStationResponseInterface,
} from '../../models/ChargingStationInterface';
import { Observable } from 'rxjs';
import { PictureDetailsInterface } from '../../models/PictureDetailsInterface';

@Injectable({
  providedIn: 'root',
})
export class ChargingStationService {
  readonly apiUrl = environment.apiUrl;
  public chargingStation = signal<ChargingStationResponseInterface[]>([]);

  constructor(private http: HttpClient) {}

  getChargingStations(): Observable<ChargingStationResponseInterface[]> {
    return this.http.get<ChargingStationResponseInterface[]>(
      `${this.apiUrl}/api/charging_stations`,
    );
  }

  getAvailableChargingStations(): Observable<
    ChargingStationResponseInterface[]
  > {
    return this.http.get<ChargingStationResponseInterface[]>(
      `${this.apiUrl}/api/charging_stations/available`,
    );
  }

  getChargingStationByUser(): Observable<ChargingStationResponseInterface[]> {
    return this.http.get<ChargingStationResponseInterface[]>(
      `${this.apiUrl}/api/users/me/charging_stations`,
    );
  }

  getChargingStationById(
    id: number,
  ): Observable<ChargingStationResponseInterface> {
    return this.http.get<ChargingStationResponseInterface>(
      `${this.apiUrl}/api/charging_stations/${id}`,
    );
  }

  postChargingStationByUser(
    data: ChargingStationRequestInterface,
  ): Observable<ChargingStationResponseInterface> {
    return this.http.post<ChargingStationResponseInterface>(
      `${this.apiUrl}/api/charging_stations`,
      data,
    );
  }

  updateOwnerSettings(
    id: number,
    data: ChargingStationOwnerUpdate
  ): Observable<ChargingStationResponseInterface> {
  
    return this.http.patch<ChargingStationResponseInterface>(
      `${this.apiUrl}/api/charging_stations/${id}/owner-settings`,
      data
    );
  }
  


  uploadTempPicture(
    file: File,
    altText: string,
  ): Observable<PictureDetailsInterface> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', altText);

    return this.http.post<PictureDetailsInterface>(
      `${this.apiUrl}/api/charging_stations/upload-temp-picture`,
      formData,
    );
  }

  uploadChargingStationPicture(
    chargingStationId: number,
    file: File,
    altText: string,
    isMain: boolean = true,
  ): Observable<PictureDetailsInterface> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    if (altText && altText.trim().length > 0) {
      formData.append('alt', altText);
    }
    formData.append('isMain', String(isMain));

    return this.http.post<PictureDetailsInterface>(
      `${this.apiUrl}/api/charging_stations/${chargingStationId}/uploadPicture`,
      formData,
    );
  }

  updateChargingStation(
    chargingStationId: number,
    data: ChargingStationRequestInterface,
  ): Observable<ChargingStationResponseInterface> {
    return this.http.put<ChargingStationResponseInterface>(
      `${this.apiUrl}/api/charging_stations/${chargingStationId}`,
      data,
    );
  }

  deleteChargingStation(id: number): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/api/charging_stations/${id}`);
  }
}
