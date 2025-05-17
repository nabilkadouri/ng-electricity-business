import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginSuccess = signal<boolean>(false); 
  loginError = signal<boolean>(false);   
  errorMessage = signal<string>('');

  constructor(private authService: AuthServiceService, private router: Router ){}

  loginForm = new FormGroup({
    username: new FormControl<string>('', { 
    nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { 
    nonNullable: true, validators: Validators.required })
    });

    onSubmit(){
      if(this.loginForm.valid){
        this.authService.login(this.loginForm.value).subscribe({
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
            if (err && err.error && err.error.error) {
              this.errorMessage.set(err.error.error);
            } else {
              this.errorMessage.set('Une erreur de connexion est survenue.');
            }
          }
        });
      }
    }

}
