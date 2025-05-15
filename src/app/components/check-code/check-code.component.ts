import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../shared/services/auth-service.service';
import { Router } from '@angular/router';
import { IToken } from '../../shared/models/AuthInterface';

@Component({
  selector: 'app-check-code',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './check-code.component.html',
  styleUrl: './check-code.component.css'
})
export class CheckCodeComponent {
  errorMessage: string | null = null;

  constructor(private authService: AuthServiceService, private router: Router) {}

  codeForm = new FormGroup({
    codeCheck: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)] 
    })
  });

  onSubmit() {
    if (this.codeForm.valid) {
      this.authService.checkCode(this.codeForm.value).subscribe({
        next: (res: IToken) => {
          this.authService.saveToken(res.token);
          this.router.navigate(['/dashboard']);
          this.errorMessage = null; 
        },
        error: (err) => {
          console.error('Code invalide', err);
          this.errorMessage = 'Le code de validation est invalide. Veuillez réessayer.'; 
        }
      });
    } else {
      this.errorMessage = 'Veuillez entrer un code de validation valide.'; 
    }
  }
}
