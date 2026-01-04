import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { CommonModule } from '@angular/common';
import {
  ChargingStationResponseInterface,
  CharginStationInterfaceMap,
} from '../../../shared/models/ChargingStationInterface';
import { ChargingStationService } from '../../../shared/services/entities/charging-station.service';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
import { UserResponseInterface } from '../../../shared/models/UserInterface';
import { BookingResponseInterface } from '../../../shared/models/BookingInterface';
import { DayOfWeek } from '../../../shared/models/TimeslotsInterface';
import { take } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  userService = inject(UserService);
  chargingStationService = inject(ChargingStationService);
  user!: UserResponseInterface;
  ownedStations: ChargingStationResponseInterface[] = [];
  bookingsWhithStationDetails: (BookingResponseInterface & {
  stationDetails?: ChargingStationResponseInterface;
  })[] = [];

  map!: maplibregl.Map;
  markers: maplibregl.Marker[] = [];

  constructor(private router: Router, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.user = user;
        this.ownedStations = user.chargingStations;
        this.loadBookingsStationsDetails();
      } else {
        console.error(
          "Erreur lors de la récupération des données utilisateur : L'objet utilisateur est null."
        );
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.mapElement || !this.mapElement.nativeElement) {
      console.error("L'élément DOM de la carte n'est pas trouvé lors de ngAfterViewInit.");
      return;
    }

    this.userService.user$.pipe(take(1)).subscribe(user => {
      if (user && user.latitude && user.longitude) {
        this.user = user; 
        this.initializeMap();
      } else {
        console.warn("Données utilisateur (latitude/longitude) non disponibles pour initialiser la carte.");
      }
    });
  }


  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // Méthode qui permet d'afficher la recharge a venir
  get nextBooking(): (BookingResponseInterface & { stationDetails?: ChargingStationResponseInterface }) | undefined {
    const now = new Date();
    return this.bookingsWhithStationDetails
      .filter(b => new Date(b.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
  }

  // Methode qui permet d'afficher la borne en location principale
  get mainStation(): ChargingStationResponseInterface | undefined {
    return this.ownedStations.length > 0 ? this.ownedStations[0] : undefined;
  }

  /**
   * Initialise la carte MapLibre GL JS avec une position et un zoom par défaut.
   * Cette version ne gère pas la géolocalisation ni l'affichage de marqueurs pour les bornes de recharge.
   */
  initializeMap(): void {
    if (!this.mapElement?.nativeElement) {
      console.error("L'élément DOM de la carte n'est pas trouvé.");
      return;
    }
  
    const defaultLat = this.user.latitude!;
    const defaultLng = this.user.longitude!;
  
    this.map = new maplibregl.Map({
      container: this.mapElement.nativeElement,
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=ykoW3p8N2j35JMOfr7ya',
      center: [defaultLng, defaultLat],
      zoom: 11.5,
      attributionControl: false,
    });
  
    this.map.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );
  
    new maplibregl.Marker({ color: 'red' })
      .setLngLat([defaultLng, defaultLat])
      .setPopup(
        new maplibregl.Popup().setHTML(`<h3>Centre de la carte</h3>`)
      )
      .addTo(this.map);
  
    // 🔥 POINT CRUCIAL
    this.map.once('load', () => {
      // 1️⃣ Force le bon calcul de taille
      this.map.resize();
  
      // 2️⃣ Charge les bornes APRES resize
      this.loadChargingStationsOnMap(defaultLat, defaultLng);
    });
  }
  

  loadChargingStationsOnMap(latitude: number, longitude: number) {
    const radiusKm = 20; 
  
    this.chargingStationService.getChargingStations().subscribe({
      next: (response: ChargingStationResponseInterface[]) => {
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
  
        const stations = response.filter((station) => { // 
          if (
            station.locationStation &&
            station.locationStation.latitude &&
            station.locationStation.longitude
          ) {
            const distanceCalculated = this.getDistance(
              latitude,
              longitude,
              station.locationStation.latitude,
              station.locationStation.longitude
            );
            
            return distanceCalculated <= radiusKm;
          }
          return false;
        });
        this.addMarkersToMap(stations); 
      },
      error: (err) => {
        console.error("Erreur lors du chargement des bornes de recharge :", err);
      }
    });
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
 
    const from = point([lon1, lat1]);
    const to = point([lon2, lat2]);

    const dist = distance(from, to, { units: 'kilometers' });

    return dist;
  }

  /**
   * Ajoute des marqueurs pour les bornes de recharge à la carte.
   * @param stations Un tableau d'objets charginStationInterfaceMap.
   */
  addMarkersToMap(stations: CharginStationInterfaceMap[]): void {
    stations.forEach((station) => {
      if (
        station.locationStation &&
        station.locationStation.latitude &&
        station.locationStation.longitude
      ) {
        let availabilityMessage: string;
        let availabilityClass: string;
        let isReservable: boolean = true; 

        if (station.timeslots && station.timeslots.length > 0 && station.timeslots[0]?.startTime && station.timeslots[0]?.endTime) {
          const startTime = station.timeslots[0].startTime.slice(0, 5);
          const endTime = station.timeslots[0].endTime.slice(0, 5);
          availabilityMessage = `Disponible de ${startTime} à ${endTime}`;
          availabilityClass = 'bg-vert-clair'; 
        } else {
          availabilityMessage = `Aucun horaire défini`;
          availabilityClass = 'bg-gray-400'; 
          isReservable = false; 
        }

        const popupContent = `
                <div>
                    <h3 class="text-lg font-semibold text-vert-foncee pb-2 text-center">${station.nameStation}</h3>
                    <p>${station.locationStation.address}, ${station.locationStation.postaleCode} ${station.locationStation.city}</p>
                    <p><strong>Puissance charge:</strong> ${station.power} kW</p>
                    <p><strong>Tarif horaire:</strong> ${station.pricePerHour} €</p>
                    <p class="inline-block mt-1 ${availabilityClass} text-white text-xs px-3 py-2 rounded w-full">
                      <span>${availabilityMessage}</span>
                    </p>
                    ${isReservable ? 
                      `<p class="mt-2 text-center text-gray-600">Réserver cette borne maintenant</p>` :
                      `<p class="mt-2 text-center text-red-600 font-semibold">Non réservable (horaires non définis)</p>`
                    }
                  </div>
              `;
        
              const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: [0, -20] })
              
                .setHTML(popupContent);

       const marker = new maplibregl.Marker({ color: '#007bff' })
               .setLngLat([
                 station.locationStation.longitude,
                 station.locationStation.latitude,
               ])
               .addTo(this.map);

               // Affiche la popup au survol
      marker.getElement().addEventListener('mouseenter', () => {
        popup.addTo(this.map);
        popup.setLngLat(marker.getLngLat());
      });

      // Cache la popup quand la souris sort du marker
      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });

      // Redirige vers la page détails au clic sur le marker
      marker.getElement().addEventListener('click', () => {
        this.ngZone.run(() => {
          if (isReservable) {
            this.router.navigate(['/dashboard/station-details', station.id]);
          } else {
            alert("Cette borne n'est pas réservable car ses horaires ne sont pas définis.");
          }
        });
      });;

      this.markers.push(marker);
      }
    });
  }

  loadBookingsStationsDetails(): void {
    this.bookingsWhithStationDetails = [];

    for (const booking of this.user.bookings) {
      this.chargingStationService
        .getChargingStationById(booking.chargingStation.id)
        .subscribe({
          next: (stationDetails: ChargingStationResponseInterface) => {
            this.bookingsWhithStationDetails.push({
              ...booking,
              stationDetails: stationDetails,
            });
          },
          error: (err) => {
            console.error(
              `Erreur lors du chargement de la borne pour booking ${booking.id}:`,
              err,
            );
            this.bookingsWhithStationDetails.push({
              ...booking,
              stationDetails: undefined,
            });
          },
        });
    }
  }

  getDisplayDay(dayName: string): string {
    const displayValue = DayOfWeek[dayName as keyof typeof DayOfWeek];
    return displayValue || dayName; // Retourne le nom original si non trouvé (fallback)
  }
}
