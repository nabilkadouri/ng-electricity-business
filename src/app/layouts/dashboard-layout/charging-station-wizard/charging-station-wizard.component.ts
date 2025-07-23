import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { LocationStationFormComponent } from "./location-station-form/location-station-form.component";
import { ChargingStationDetailsFormComponent } from "./charging-station-details-form/charging-station-details-form.component";
import { TimeslotSelectionFormComponent } from "./timeslot-selection-form/timeslot-selection-form.component";

@Component({
  selector: 'app-charging-station-wizard',
  imports: [CommonModule, ChargingStationDetailsFormComponent, TimeslotSelectionFormComponent, LocationStationFormComponent],
  templateUrl: './charging-station-wizard.component.html',
  standalone: true,
  styleUrl: './charging-station-wizard.component.css'
})
export class ChargingStationWizardComponent {
  currentStep: number = 1;
  locationStationId: number | null = null;
  chargingStationId: number | null = null;

  constructor(private route: Router) {}

  onLocationSubmitted(locationId: number): void {
    this.locationStationId = locationId;
    this.currentStep = 2; 
    console.log('LocationStation ID reçue:', locationId, 'Passage à l\'étape 2.');
  }

  onChargingStationSubmitted(stationId: number): void {
    this.chargingStationId = stationId;
    this.currentStep = 3; 
    console.log('ChargingStation ID reçue:', stationId, 'Passage à l\'étape 3.');
  }

  onTimeslotsSubmitted(): void {
    alert('Borne et ses disponibilités ajoutées avec succès !');
    console.log('Tous les formulaires soumis avec succès. Réinitialisation.');
    this.currentStep = 1; 
    this.locationStationId = null;
    this.chargingStationId = null;
    this.route.navigate(["/dashboard/userStations"]);
  }
}
