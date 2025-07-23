import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
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

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  userService = inject(UserService);
  chargingStationService = inject(ChargingStationService);
  user!: UserResponseInterface;
  currentBookings: BookingResponseInterface[] = [];
  ownedStations: ChargingStationResponseInterface[] = [];
  bookingsWhithStationDetails: (BookingResponseInterface & {
    stationDetails?: ChargingStationResponseInterface;
  })[] = [];

  map!: maplibregl.Map;
  markers: maplibregl.Marker[] = [];

  mockNearbyStations: CharginStationInterfaceMap[] = [
    {
      id: 1,
      nameStation: 'Borne Centre Saint-Priest',
      power: 50,
      pricePerHour: 0.3,
      locationStation: {
        id: 101,
        locationName: 'Centre Saint-Priest',
        address: "1 Rue de l'Hôtel de Ville",
        postaleCode: '69800',
        city: 'Saint-Priest',
        latitude: 45.6987,
        longitude: 4.94,
      },
      timeslots: [
        {
          id: 1001,
          dayOfWeek: 'Lundi',
          startTime: '2025-01-01T08:00:00',
          endTime: '2025-01-01T09:00:00',
          isAvailable: true,
        },
        {
          id: 1002,
          dayOfWeek: 'Lundi',
          startTime: '2025-01-01T09:00:00',
          endTime: '2025-01-01T10:00:00',
          isAvailable: false,
        },
      ],
    },
    {
      id: 2,
      nameStation: 'Superchargeur Technopole',
      power: 150,
      pricePerHour: 0.45,
      locationStation: {
        id: 102,
        locationName: 'Technopole Est',
        address: '20 Avenue Jean Mermoz',
        postaleCode: '69800',
        city: 'Saint-Priest',
        latitude: 45.705,
        longitude: 4.935,
      },
      timeslots: [
        {
          id: 2001,
          dayOfWeek: 'Mardi',
          startTime: '2025-01-01T10:00:00',
          endTime: '2025-01-01T11:00:00',
          isAvailable: true,
        },
        {
          id: 2002,
          dayOfWeek: 'Mardi',
          startTime: '2025-01-01T11:00:00',
          endTime: '2025-01-01T12:00:00',
          isAvailable: true,
        },
      ],
    },
    {
      id: 3,
      nameStation: 'Parking Relais Saint-Priest',
      power: 22,
      pricePerHour: 0.25,
      locationStation: {
        id: 103,
        locationName: 'Parking Relais',
        address: '5 Rue du Dauphiné',
        postaleCode: '69800',
        city: 'Saint-Priest',
        latitude: 45.69,
        longitude: 4.95,
      },
      timeslots: [
        {
          id: 3001,
          dayOfWeek: 'Mercredi',
          startTime: '2025-01-01T14:00:00',
          endTime: '2025-01-01T15:00:00',
          isAvailable: true,
        },
      ],
    },
    {
      id: 4,
      nameStation: 'Recharge Express Gare Saint-Priest',
      power: 7,
      pricePerHour: 0.2,
      locationStation: {
        id: 104,
        locationName: 'Gare SNCF',
        address: 'Place de la Gare',
        postaleCode: '69800',
        city: 'Saint-Priest',
        latitude: 45.695,
        longitude: 4.945,
      },
      timeslots: [],
    },
  ];

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
    // Initialise directement la carte avec des coordonnées par défaut
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  /**
   * Initialise la carte MapLibre GL JS avec une position et un zoom par défaut.
   * Cette version ne gère pas la géolocalisation ni l'affichage de marqueurs pour les bornes de recharge.
   */
  initializeMap(): void {
    try {
      // Coordonnées par défaut (par exemple, le centre de Paris)
      const defaultLat = 45.6833; // Latitude de Paris
      const defaultLng = 4.9333; // Longitude de Paris

      this.map = new maplibregl.Map({
        container: 'map',
        style:
          'https://api.maptiler.com/maps/basic-v2/style.json?key=ykoW3p8N2j35JMOfr7ya', // Le style de la carte (une carte de base claire)
        center: [defaultLng, defaultLat], // Le centre initial de la carte [longitude, latitude]
        zoom: 11.5, // Le niveau de zoom initial
        attributionControl: false, // Désactive le contrôle d'attribution par défaut
      });

      // Ajoute les contrôles de navigation (zoom +/- et boussole) à la carte
      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

      new maplibregl.Marker({ color: 'red' })
        .setLngLat([defaultLng, defaultLat])
        .setPopup(new maplibregl.Popup().setHTML(`<h3>Centre de la carte</h3>`))
        .addTo(this.map);

      // Charge les bornes de recharge sur la carte une fois que la carte est prête
      this.map.on('load', () => {
        this.loadChargingStationsOnMap(defaultLat, defaultLng);
      });
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte :", error);
    }
  }

  loadChargingStationsOnMap(latitude: number, longitude: number) {
    const radiusKm = 10;

    const Stations = this.mockNearbyStations.filter((station) => {
      if (
        station.locationStation &&
        station.locationStation.latitude &&
        station.locationStation.longitude
      ) {
        const distanceCalculated = this.getDistance(
          latitude,
          longitude,
          station.locationStation.latitude,
          station.locationStation.longitude,
        );
        return distanceCalculated <= radiusKm;
      }
      return false;
    });
    this.addMarkersToMap(Stations);
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Créez les points géographiques au format attendu par Turf.js
    // point([longitude, latitude])
    const from = point([lon1, lat1]);
    const to = point([lon2, lat2]);

    // Calculez la distance. Par défaut, elle est en kilomètres.
    // Vous pouvez spécifier l'unité : { units: 'kilometers' }, 'miles', 'nauticalmiles', etc.
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
        const popupContent = `
        <div class="p-2">
          <h3 class="text-lg font-semibold text-vert-foncee">${station.nameStation}</h3>
          <p>${station.locationStation.address}, ${station.locationStation.postaleCode} ${station.locationStation.city}</p>
          <p><strong>Puissance:</strong> ${station.power}</p>
          <p><strong>Prix/heure:</strong> ${station.pricePerHour}</p>
        </div>
      `;

        const marker = new maplibregl.Marker({ color: '#007bff' }) 
          .setLngLat([
            station.locationStation.longitude,
            station.locationStation.latitude,
          ])
          .setPopup(new maplibregl.Popup().setHTML(popupContent))
          .addTo(this.map);
        this.markers.push(marker);
      }
    });
  }

  loadBookingsStationsDetails(): void {
    this.bookingsWhithStationDetails = [];

    for (const booking of this.user.bookings) {
      this.chargingStationService
        .getChargingStationById(booking.chargingStationId)
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
