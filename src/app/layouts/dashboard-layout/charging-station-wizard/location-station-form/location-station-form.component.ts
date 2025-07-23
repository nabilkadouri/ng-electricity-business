import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationServiceService } from '../../../../shared/services/entities/location-service.service';
import { NominatimService } from '../../../../shared/services/geocoding/nominatim.service';

@Component({
  selector: 'app-location-station-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './location-station-form.component.html',
  styleUrl: './location-station-form.component.css'
})
export class LocationStationFormComponent implements OnInit {
  @Output() locationSubmitted = new EventEmitter<number>(); // Émet l'ID de la localisation créée
  locationForm: FormGroup;
  isLoadingGeocoding: boolean = false;

  constructor(private fb: FormBuilder, private locationService: LocationServiceService, private nominatimService: NominatimService) {
    this.locationForm = this.fb.group({
      name: [''], 
      address: ['', Validators.required],
      postaleCode: ['', Validators.required],
      city: ['', Validators.required],
      latitude: [null],
      longitude: [null]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.isLoadingGeocoding = true; // Débute l'état de chargement

      const { address, postaleCode, city } = this.locationForm.value;
      const fullAddress = `${address}, ${postaleCode} ${city}`;

      this.nominatimService.getCoordinates(fullAddress).subscribe({
        next: (coordinates) => {
          this.isLoadingGeocoding = false; // Fin de l'état de chargement

          if (coordinates) {
            this.locationForm.patchValue({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            });
            this.sendLocationToBackend(); // Envoyer au backend après avoir obtenu les coordonnées
          } else {
            console.error('Impossible de récupérer les coordonnées pour l\'adresse fournie.');
          }
        },
        error: (error) => {
          this.isLoadingGeocoding = false; // Fin de l'état de chargement en cas d'erreur
          console.error('Erreur lors du géocodage:', error);
        }
      });
    } else {
      console.warn('Formulaire LocationStation invalide. Veuillez remplir tous les champs requis.');
    }
  }

  private sendLocationToBackend(): void {
    console.log('Soumission LocationStation avec coordonnées:', this.locationForm.value);
    this.locationService.createLocationStation(this.locationForm.value).subscribe({
      next: (response: any) => {
        console.log('LocationStation créée avec succès:', response);
        this.locationSubmitted.emit(response.id); // Transmet l'ID au parent
      },
      error: (error: any) => {
        console.error('Erreur lors de la création de LocationStation:', error);
      }
    });
  }

}
