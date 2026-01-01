import { CommonModule } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import maplibregl from 'maplibre-gl';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NominatimService } from '../../../../../../shared/services/geocoding/nominatim.service';
import { ChargingStationService } from '../../../../../../shared/services/entities/charging-station.service';
import { CharginStationInterfaceMap } from '../../../../../../shared/models/ChargingStationInterface';
import { UserService } from '../../../../../../shared/services/entities/user.service';

@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maps.component.html',
})
export class MapsComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  map!: maplibregl.Map;
  markers: maplibregl.Marker[] = [];

  // Barre de recherche
  searchTerm = '';
  suggestions: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private nominatimService: NominatimService,
    private chargingStationService: ChargingStationService,
    private userService: UserService,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    // Prépare la recherche
    this.initializeSearch();

    // Récupère la position de l'utilisateur
    this.detectUserPosition();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }

  //  Détection de la position utilisateur
  detectUserPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          console.log("Position détectée via navigateur :", lat, lon);
          this.initializeMap(lat, lon);
        },
        err => {
          console.warn("Permission refusée → Fallback IP...");
          this.loadIpFallback();
        }
      );
    } else {
      this.loadIpFallback();
    }
  }

  // Fallback via API IPINFO (compatible CORS)
  loadIpFallback() {
    fetch("https://ipinfo.io/json?token=6f0d247e7d40d2") // ← Mets ton token
      .then(res => res.json())
      .then(data => {
        const [lat, lon] = data.loc.split(",");
        console.log("Position estimée par IP :", lat, lon);
        this.initializeMap(parseFloat(lat), parseFloat(lon));
      })
      .catch(err => {
        console.error("Impossible d'obtenir la position par IP", err);
        // Dernier fallback : centre sur Paris
        this.initializeMap(48.8566, 2.3522);
      });
  }

  // nitialisation de la carte
  initializeMap(lat: number, lon: number) {
    if (!this.mapElement) return;

    this.map = new maplibregl.Map({
      container: this.mapElement.nativeElement,
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=ykoW3p8N2j35JMOfr7ya',
      center: [lon, lat],
      zoom: 14,
      attributionControl: false,
    });

    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Ajout du marker principal (user)
    new maplibregl.Marker({ color: 'red' })
      .setLngLat([lon, lat])
      .addTo(this.map);

    this.map.on('load', () => {
      this.loadChargingStationsOnMap(lat, lon);
    });

    setTimeout(() => this.map.resize(), 200);
  }

  // Gestion de la barre de recherche
  initializeSearch() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.nominatimService.searchAddress(term))
    ).subscribe(results => {
      this.suggestions = results;
    });
  }

  onSearchChange() {
    if (this.searchTerm.length > 2) {
      this.searchSubject.next(this.searchTerm);
    } else {
      this.suggestions = [];
    }
  }

  selectAddress(address: any) {
    this.searchTerm = address.display_name;
    this.suggestions = [];

    const lat = parseFloat(address.lat);
    const lon = parseFloat(address.lon);

    this.map.flyTo({ center: [lon, lat], zoom: 14 });

    this.loadChargingStationsOnMap(lat, lon);
  }

  // Chargement des bornes autour de l’utilisateur
  loadChargingStationsOnMap(lat: number, lon: number) {
    const radiusKm = 20;

    this.chargingStationService.getChargingStations().subscribe({
      next: stations => {
        this.markers.forEach(m => m.remove());
        this.markers = [];

        const nearby = stations.filter(station => {
          if (station.locationStation?.latitude && station.locationStation?.longitude) {
            const dist = this.getDistance(
              lat,
              lon,
              station.locationStation.latitude,
              station.locationStation.longitude
            );

            return dist <= radiusKm;
          }
          return false;
        });

        this.addMarkersToMap(nearby);
      },
      error: err => {
        console.error("Impossible de charger les bornes :", err);
      }
    });
  }

  // Calcul de distance avec TurfJS
  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const from = point([lon1, lat1]);
    const to = point([lon2, lat2]);
    return distance(from, to, { units: 'kilometers' });
  }

  // Ajout des markers de bornes + popup + redirection
  addMarkersToMap(stations: CharginStationInterfaceMap[]) {
    stations.forEach(station => {
      if (!station.locationStation) return;

      const marker = new maplibregl.Marker({ color: '#007bff' })
        .setLngLat([
          station.locationStation.longitude,
          station.locationStation.latitude
        ])
        .addTo(this.map);

      const popupHtml = `
        <div>
          <h3 class="text-lg font-semibold">${station.nameStation}</h3>
          <p>${station.locationStation.address}</p>
          <p>Puissance : ${station.power} kW</p>
          <p>Tarif : ${station.pricePerHour} € / h</p>
        </div>
      `;

      const popup = new maplibregl.Popup({ closeButton: false }).setHTML(popupHtml);

      marker.getElement().addEventListener('mouseenter', () => popup.addTo(this.map));
      marker.getElement().addEventListener('mouseleave', () => popup.remove());

      marker.getElement().addEventListener('click', () => {
        this.ngZone.run(() => {
      
          if (!this.userService.isLoggedIn()) {
            // Optionnel : message personnalisé
            alert("Vous devez créer un compte ou vous connecter pour voir les détails d'une borne.");
            
            // Redirection vers l'inscription
            this.router.navigate(['/register']);
            return; 
          }
      
          // Sinon : accès OK aux détails
          this.router.navigate(['/dashboard/station-details', station.id]);
        });
      });

      this.markers.push(marker);
    });
  }

  
  
}
