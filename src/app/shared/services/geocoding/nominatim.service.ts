import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Coordinates, NominatimResult } from '../../models/LocationStationInterface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {

  private apiURL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les coordonnées d'une adresse (1 résultat)
   */
  getCoordinates(address: string): Observable<Coordinates | null> {

    if (!address) {
      return of(null);
    }

    return this.http.get<NominatimResult[]>(
      `${this.apiURL}/api/geocoding/search`,
      { params: { q: address } }
    ).pipe(
      map(response => {
        if (response && response.length > 0) {
          return {
            latitude: parseFloat(response[0].lat),
            longitude: parseFloat(response[0].lon)
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Erreur géocodage:', error);
        return of(null);
      })
    );
  }

  /**
   * Recherche suggestions (autocomplete)
   */
  searchAddress(query: string): Observable<NominatimResult[]> {

    return this.http.get<NominatimResult[]>(
      `${this.apiURL}/api/geocoding/search`,
      { params: { q: query } }
    );
  }
}

