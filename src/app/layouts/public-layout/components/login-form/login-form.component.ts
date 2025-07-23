import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginSuccess = signal<boolean>(false); 
  loginError = signal<boolean>(false);   
  errorMessage = signal<string>('');

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true, 
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: Validators.required
    })
  });

  constructor(private authService: AuthServiceService, private router: Router ){}

    onSubmit(){
    this.loginSuccess.set(false);
    this.loginError.set(false);
    this.errorMessage.set('');
    const credentials = this.loginForm.value as { email: string; password: string };
      if(this.loginForm.valid){
        this.authService.login(credentials).subscribe({
          next: (response)=> {
          this.loginSuccess.set(true);
          this.loginError.set(false);
          this.router.navigate(['/check'])
          console.log('Connexion réussie', response);
          },
          error: (err) => {
            this.loginSuccess.set(false);
            this.loginError.set(true);
            console.error('Erreur de connection', err);
            this.errorMessage.set('Une erreur de connexion est survenue.');
          }
        });
      }
    }
}
