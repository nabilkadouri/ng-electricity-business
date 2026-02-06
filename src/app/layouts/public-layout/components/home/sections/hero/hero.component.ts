import { Component, EventEmitter, Output } from '@angular/core';
import { AuthServiceService } from '../../../../../../shared/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {

  @Output() reserve = new EventEmitter<void>();
  @Output() propose = new EventEmitter<void>();

}
