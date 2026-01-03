import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { CodeCheckRequestInterface, IToken, LoginResponseInterface } from '../../../../shared/models/AuthInterface';


@Component({
  selector: 'app-check-code',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './check-code.component.html',
  styleUrl: './check-code.component.css'
})
export class CheckCodeComponent implements OnInit{
  errorMessage = signal<string | null>(null)
  private userEmail: string | null = null;

  codeForm = new FormGroup({
    codeCheck: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,         
        Validators.minLength(6),     
        Validators.maxLength(6),     
        Validators.pattern(/^\d{6}$/)
      ]
    })
  });

  constructor(private authService: AuthServiceService, private router: Router) {}

  ngOnInit(): void {

    this.userEmail = this.authService.getTempUserEmail();

    if (!this.userEmail) {
      this.errorMessage.set('Session expirée ou email non trouvé. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
    }
      
  }

  onSubmit(): void{
    this.errorMessage.set(null);

    if (this.codeForm.valid) {
      const codeCheckRequest: CodeCheckRequestInterface ={
        email: this.userEmail!,
        codeCheck: this.codeForm.value.codeCheck!
      };

      this.authService.checkCode(codeCheckRequest).subscribe({
        next: (res: LoginResponseInterface) => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Code invalide', err);
          this.errorMessage.set('Le code de validation est invalide. Veuillez réessayer.'); 
        }
      });
    } else {
      this.errorMessage.set ('Veuillez entrer un code de validation valide.'); 
    }
  }
}
