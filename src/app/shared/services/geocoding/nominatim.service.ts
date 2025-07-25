import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { Coordinates, NominatimResult } from '../../models/LocationStationInterface';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {
  private readonly NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) { }

  /**
   * Récupère les coordonnées (latitude, longitude) pour une adresse donnée via Nominatim.
   * @param address L'adresse complète à géocoder.
   * @returns Un Observable qui émet les coordonnées ou null si non trouvées/erreur.
   */
  getCoordinates(address: string): Observable<Coordinates | null> {
    if (!address) {
      console.warn('NominatimService: Adresse vide fournie pour le géocodage.');
      return of(null);
    }

    const params = {
      q: address,
      format: 'json',
      limit: '1',
      addressdetails: '0'
    };

    return this.http.get<NominatimResult[]>(this.NOMINATIM_API_URL, { params}).pipe(
      map(response => {
        if (response && response.length > 0) {
          const result = response[0];
          return {
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon)
          };
        } else {
          console.warn('NominatimService: Aucun résultat trouvé pour l\'adresse:', address);
          return null;
        }
      }),
      catchError(error => {
        console.error('NominatimService: Erreur lors de l\'appel API Nominatim:', error);
        return of(null); 
      })
    );
  }
}
