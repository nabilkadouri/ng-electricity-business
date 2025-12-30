import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { UserService } from '../../../../shared/services/entities/user.service';
import { Route, Router } from '@angular/router';
import { ChargingStationFormModel, ChargingStationRequestInterface, ChargingStationResponseInterface, ChargingStationStatus } from '../../../../shared/models/ChargingStationInterface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-charging-station-details-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './charging-station-details-form.component.html',
  standalone: true,
  styleUrl: './charging-station-details-form.component.css'
})
export class ChargingStationDetailsFormComponent {
  @Input() locationStationId!: number; 
  @Output() chargingStationSubmitted = new EventEmitter<number>(); 

  chargingStationForm!: FormGroup;

  currentUserId: number | undefined = undefined; 

  chargingStation! : ChargingStationFormModel

  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private chargingStationService: ChargingStationService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.chargingStation = {
      nameStation: '',
      description: '',
      power: 0,
      pricePerHour: 0,
      picture: undefined,
      status: ChargingStationStatus.PENDING,
      isAvailable: true,
      locationStationId: this.locationStationId,
      userId: undefined
    };

    this.chargingStationForm = this.fb.group({
      nameStation: ['', Validators.required],
      description: ['', Validators.required],
      power: ['', Validators.required],
      pricePerHour: ['', [Validators.required, Validators.min(0)]]
    });

    this.userService.user$?.subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.chargingStation.userId = user.id;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Le fichier doit être une image';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.chargingStationService
      .uploadTempPicture(file, 'Photo de la borne')
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (picture) => {
          this.chargingStation = {
            ...this.chargingStation,
            picture
          };
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l’upload de l’image';
        }
      });
  }

  onSubmit(): void {

    if (this.chargingStationForm.invalid || !this.locationStationId || !this.currentUserId
    ) {
      this.errorMessage = 'Formulaire incomplet';
      return;
    }

    this.chargingStation = {...this.chargingStation, ...this.chargingStationForm.value,locationStationId: this.locationStationId, userId: this.currentUserId};

    const payload: ChargingStationRequestInterface = {
      nameStation: this.chargingStation.nameStation,
      description: this.chargingStation.description,
      power: this.chargingStation.power ?? 0,
      pricePerHour: this.chargingStation.pricePerHour ?? 0,
      picture: this.chargingStation.picture, 
      status: this.chargingStation.status,
      isAvailable: this.chargingStation.isAvailable,
      locationStationId: this.locationStationId,
      userId: this.currentUserId
    };

    this.isLoading = true;

    this.chargingStationService
      .postChargingStationByUser(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          this.successMessage = 'Borne créée avec succès';
          this.chargingStationSubmitted.emit(response.id);
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la création de la borne';
        }
      });
  }
}
