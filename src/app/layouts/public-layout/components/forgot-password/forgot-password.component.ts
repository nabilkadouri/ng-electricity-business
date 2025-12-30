import { Component } from '@angular/core';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule,RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthServiceService) {}

  sendEmail() {
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (msg) => {
        this.successMessage = msg;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Erreur : email inconnu ou problème serveur.";
        this.isLoading = false;
      }
    });
  }

}
