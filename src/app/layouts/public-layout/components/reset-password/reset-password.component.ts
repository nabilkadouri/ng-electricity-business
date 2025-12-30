import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  token = '';
  password = '';
  confirmPassword = '';

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private route: ActivatedRoute, private authService: AuthServiceService) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.token, this.password).subscribe({
      next: (msg) => {
        this.successMessage = msg;
        this.errorMessage = '';
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = "Lien invalide ou expiré.";
        this.isLoading = false;
      }
    });
  }

}
