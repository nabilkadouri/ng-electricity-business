import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChargingStationService } from '../../../../shared/services/entities/charging-station.service';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { UserService } from '../../../../shared/services/entities/user.service';
import { Route, Router } from '@angular/router';
import { ChargingStationRequestInterface } from '../../../../shared/models/ChargingStationInterface';

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

  chargingStationForm: FormGroup;
  currentUserId: number | undefined = undefined; 

  constructor(
    private fb: FormBuilder,
    private chargingStationService: ChargingStationService,
    private userService: UserService,
  ) {
    this.chargingStationForm = this.fb.group({
      nameStation: ['', Validators.required],
      description: ['', Validators.required],
      power: ['', Validators.required],
      pricePerHour: ['', [Validators.required, Validators.min(0)]],
      picture: ['images/default_picture_station.png'], 
      status: ['En attente'], 
      isAvailable: [true] 
    });
  }

  ngOnInit(): void {
    this.userService.user$?.subscribe(user => {
      this.currentUserId = user?.id; 
    });

  }

  onSubmit(): void {
    if (this.chargingStationForm.valid && this.locationStationId && this.currentUserId) {
      const formData: ChargingStationRequestInterface = { ...this.chargingStationForm.value,
        locationStation: `/api/location_stations/${this.locationStationId}`,
        
       };

       if (formData.pricePerHour !== null && formData.pricePerHour !== undefined) {
        formData.pricePerHour = formData.pricePerHour;
      }

      if (formData.power !== null && formData.power !== undefined) {
        formData.power = formData.power;
      }

      formData.userId = this.currentUserId; 

      console.log('Soumission ChargingStation:', formData);
      this.chargingStationService.postChargingStationByUser(formData).subscribe({
        next: (response:any) => {
          console.log('ChargingStation créée avec succès:', response);
          this.chargingStationSubmitted.emit(response.id);
        },
        error: (error:any) => {
          console.error('Erreur lors de la création de ChargingStation:', error);
        }
      });


    } else {
      console.warn('Formulaire ChargingStation invalide, locationStationId ou User ID manquant.');
    }
    
  }
  
}
