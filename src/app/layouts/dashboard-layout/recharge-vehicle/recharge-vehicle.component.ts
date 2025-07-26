import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChargingStationService } from '../../../shared/services/entities/charging-station.service';
import { ChargingStationResponseInterface, CharginStationInterfaceMap } from '../../../shared/models/ChargingStationInterface';
import { NominatimService } from '../../../shared/services/geocoding/nominatim.service';
import { UserService } from '../../../shared/services/entities/user.service';
import { UserResponseInterface } from '../../../shared/models/UserInterface';
import maplibregl from 'maplibre-gl';
import { take } from 'rxjs';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recharge-vehicle',
  imports: [CommonModule,],
  templateUrl: './recharge-vehicle.component.html',
  styleUrl: './recharge-vehicle.component.css'
})
export class RechargeVehicleComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement', { static: false}) mapElement!: ElementRef;
  
chargingStationService = inject(ChargingStationService);
nominatimService = inject(NominatimService);

chargingStations: ChargingStationResponseInterface[] = [];
userService = inject(UserService);
user!: UserResponseInterface;

map!: maplibregl.Map;
markers: maplibregl.Marker[] = [];

constructor(private router: Router, private ngZone: NgZone) {}


ngOnInit(): void {
  
    
}

ngAfterViewInit(): void {
  if(!this.mapElement || !this.mapElement.nativeElement) {
    console.error("L'élément DOM de la carte introuvable !")
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

initializeMap():void {

  if(this.map){
    console.warn("La carte est déjà initialisée.");
      return;
  }
  try {
    
      const defaultLat = this.user.latitude!;
      const defaultLng = this.user.longitude!;

      this.map = new maplibregl.Map({
        container: this.mapElement.nativeElement,
        style:
          'https://api.maptiler.com/maps/basic-v2/style.json?key=ykoW3p8N2j35JMOfr7ya', 
        center: [defaultLng, defaultLat], 
        zoom: 13, 
        attributionControl: false,
      });

      //Ajoute du controle de navigation
      this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
      
      new maplibregl.Marker({ color: 'red' })
        .setLngLat([defaultLng, defaultLat])
        .setPopup(new maplibregl.Popup().setHTML(`<h3>Centre de la carte</h3>`))
        .addTo(this.map);

        // Charger les bornes sur la carte
        this.map.on('load', () => {
          this.loadChargingStationsOnMap(defaultLat, defaultLng);
        });
        setTimeout(() => {
          if (this.map) {
            this.map.resize();
          }
        }, 200);
      } catch (error){
    console.error("Erreur lors de l'intialisation de la carte", error);
  }
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
  // Créez les points géographiques au format attendu par Turf.js
  // point([longitude, latitude])
  const from = point([lon1, lat1]);
  const to = point([lon2, lat2]);

  // Calculez la distance. Par défaut, elle est en kilomètres.
  // Vous pouvez spécifier l'unité : { units: 'kilometers' }, 'miles', 'nauticalmiles', etc.
  const dist = distance(from, to, { units: 'kilometers' });

  return dist;
}

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
          <p class="mt-2 text-sm text-blue-600 font-semibold">Cliquez ici pour réserver cette borne</p>
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

      // ✅ Affiche la popup au survol
      marker.getElement().addEventListener('mouseenter', () => {
        popup.addTo(this.map);
        popup.setLngLat(marker.getLngLat());
      });

      // ✅ Cache la popup quand la souris sort du marker
      marker.getElement().addEventListener('mouseleave', () => {
        popup.remove();
      });

      // ✅ Redirige vers la page détails au clic sur le marker
      marker.getElement().addEventListener('click', () => {
        this.ngZone.run(() => {
          console.log('Click sur station', station.id);
          this.router.navigate(['/dashboard/borne-details', station.id]);
        });
      });

      this.markers.push(marker);
    }
  })

}


}
