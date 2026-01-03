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

  readonly daysOfWeek = [
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


  toggleDay(dayValue: string): void {
    const index = this.selectedDays.indexOf(dayValue);
    index === -1
      ? this.selectedDays.push(dayValue)
      : this.selectedDays.splice(index, 1);
  
    this.cdr.detectChanges();
  }

  isDaySelected(dayValue: string): boolean {
    return this.selectedDays.includes(dayValue);
  }

  onSubmit(): void {
    if (this.timeslotForm.invalid || !this.selectedDays.length || !this.chargingStationId) {
      console.warn('Formulaire invalide ou jours non sélectionnés');
      return;
    }

    const { startTime, endTime } = this.timeslotForm.value;

    const timeslotsToCreate = this.selectedDays.map(day => ({
      dayOfWeek: day as DayOfWeek,
      startTime,
      endTime,
      chargingStationId: this.chargingStationId,
    }));


    this.timeslotService.createMultipleTimeslots(timeslotsToCreate).subscribe({
      next: () => this.timeslotsSubmitted.emit(),
      error: err => console.error('Erreur lors de la création des créneaux :', err),
    });
  }

}
