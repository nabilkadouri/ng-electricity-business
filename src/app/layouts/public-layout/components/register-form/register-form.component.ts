import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  constructor(private authService: AuthServiceService, private router: Router) {}

  registerForm = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true, validators: Validators.required
    }),
    firstName: new FormControl<string>('', {
      nonNullable: true, validators: Validators.required
    }),
    phoneNumber: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
      ]
    }),
    email: new FormControl<string>('', {
      nonNullable: true, validators: [Validators.required, Validators.email]
    }),
    password: new FormControl<string>('', {
      nonNullable: true, validators: Validators.required
    }),
    confirmPassword: new FormControl<string>('', { // Ajout du contrôle confirmPassword
      nonNullable: true, validators: Validators.required
    }),
    address: new FormControl<string>('', {
      nonNullable: true, validators: Validators.required
    }),
    postaleCode: new FormControl('', {
      nonNullable: true, validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]
    }),
    city: new FormControl<string>('', {
      nonNullable: true, validators: Validators.required
    }),
  }, { validators: this.mustMatch('password', 'confirmPassword') }); // Ajout du validateur au FormGroup

  get f() { return this.registerForm.controls; } // Getter pour accéder facilement aux contrôles du formulaire

  mustMatch(controlName: string, matchingControlName: string) {
    return (control: AbstractControl) => { // Change AbstractControl ici
      const formGroup = control as FormGroup; // Castez AbstractControl en FormGroup
      const passwordControl = formGroup.controls[controlName];
      const confirmPasswordControl = formGroup.controls[matchingControlName];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']) {
        return null; // Retournez null si une autre erreur existe déjà
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
      return null; // Les validateurs de groupe doivent retourner null si la validation réussit
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.authService.login({username: this.registerForm.value.email, password: this.registerForm.value.password}).subscribe({
            next: (response) =>{
              this.router.navigate(['/check'])
            }
          })
          console.log('Inscription réussie');
        },
        error: (err) => {
          console.error("Erreur lors de l'inscription", err);
        }
      });
    }
  }
}
