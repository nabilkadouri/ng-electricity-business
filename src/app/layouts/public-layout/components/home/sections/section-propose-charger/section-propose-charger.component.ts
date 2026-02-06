import { Component, EventEmitter, Output } from '@angular/core';
import { AuthServiceService } from '../../../../../../shared/services/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-propose-charger',
  imports: [],
  templateUrl: './section-propose-charger.component.html',
  styleUrl: './section-propose-charger.component.css'
})
export class SectionProposeChargerComponent {
  @Output() propose = new EventEmitter<void>();

  constructor(private authService: AuthServiceService, private router: Router ){}

  onProposeClick(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard/proposerBorne']);
    } else {
      this.router.navigate(['/register']);
    }
  }

}
