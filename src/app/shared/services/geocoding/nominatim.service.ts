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

    // Il est important de fournir un User-Agent pour Nominatim.
    // Indiquez le nom de votre application et une adresse email de contact.
    const headers = {
      'User-Agent': 'YourAppNameAngular/1.0 (your_email@example.com)' // Adaptez avec votre info
    };

    return this.http.get<NominatimResult[]>(this.NOMINATIM_API_URL, { params, headers }).pipe(
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
        // Vous pouvez ajouter une logique de gestion d'erreur plus sophistiquée ici,
        // comme afficher un message à l'utilisateur ou retenter l'opération.
        return of(null); // Retourne null en cas d'erreur
      })
    );
  }
}
