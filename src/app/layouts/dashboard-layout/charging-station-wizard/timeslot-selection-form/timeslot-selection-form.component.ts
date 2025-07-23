import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeslotService } from '../../../../shared/services/entities/timeslot.service';
import { DayOfWeek } from '../../../../shared/models/TimeslotsInterface';

@Component({
  selector: 'app-timeslot-selection-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './timeslot-selection-form.component.html',
  standalone: true,
  styleUrl: './timeslot-selection-form.component.css'
})
export class TimeslotSelectionFormComponent {
  @Input() chargingStationId!: number; 
  @Output() timeslotsSubmitted = new EventEmitter<void>(); 

  timeslotForm: FormGroup;
  selectedDays: string[] = []; 

  daysOfWeek = [
    { label: 'L', value: 'Lundi' },
    { label: 'Ma', value: 'Mardi' },
    { label: 'Me', value: 'Mercredi' },
    { label: 'J', value: 'Jeudi' },
    { label: 'V', value: 'Vendredi' },
    { label: 'S', value: 'Samedi' },
    { label: 'D', value: 'Dimanche' }
  ];

  constructor(private fb: FormBuilder, private timeslotService: TimeslotService, private cdr: ChangeDetectorRef ) {
    this.timeslotForm = this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  ngOnInit(): void {
   
  }

  toggleDay(dayValue: string): void {
    if (this.selectedDays.includes(dayValue)) {
      this.selectedDays = this.selectedDays.filter(day => day !== dayValue);
    } else {
      this.selectedDays = [...this.selectedDays, dayValue]; 
    }

    this.selectedDays.sort((a, b) => {
        const daysOrder = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        return daysOrder.indexOf(a) - daysOrder.indexOf(b);
    });
    console.log('Jours sélectionnés:', this.selectedDays);
  this.cdr.detectChanges();

  }

  isDaySelected(dayValue: string): boolean {
    return this.selectedDays.includes(dayValue);
  }

  onSubmit(): void {
    if (this.timeslotForm.valid && this.selectedDays.length > 0 && this.chargingStationId) {
      const { startTime, endTime } = this.timeslotForm.value;
    
      // Mapper les jours sélectionnés en objets Timeslot pour l'API batch
      const timeslotsToCreate = this.selectedDays.map(day => ({
        dayOfWeek: day as DayOfWeek,
        startTime: startTime + ':00', 
        endTime: endTime + ':00',
        chargingStationId: this.chargingStationId
      }));

      console.log('Soumission Timeslots:', timeslotsToCreate);
      this.timeslotService.createMultipleTimeslots(timeslotsToCreate).subscribe({
        next: (response) => {
          console.log('Timeslots créés avec succès:', response);
          this.timeslotsSubmitted.emit(); // Informe le parent que l'opération est complète
        },
        error: (error) => {
          console.error('Erreur lors de la création des timeslots:', error);
        }
      });
    } else {
      console.warn('Formulaire Timeslot invalide, aucun jour sélectionné, ou ChargingStationId manquant.');
    }
  }
}
