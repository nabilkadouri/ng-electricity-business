import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { LoginRequestInterface, RegisterRequestInterface } from '../../../../shared/models/AuthInterface';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, CommonModule,RouterLink],
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
  }, { validators: this.mustMatch('password', 'confirmPassword') }); 

  get f() { return this.registerForm.controls; } 

  mustMatch(controlName: string, matchingControlName: string) {
    return (control: AbstractControl) => {
      const formGroup = control as FormGroup;
      const passwordControl = formGroup.controls[controlName];
      const confirmPasswordControl = formGroup.controls[matchingControlName];

      if (!passwordControl || !confirmPasswordControl) { // Ajoutez des vérifications de nullité
        return null;
      }

      // Supprimez l'erreur mustMatch pour éviter les conflits
      if (confirmPasswordControl.errors && confirmPasswordControl.errors['mustMatch']) {
        confirmPasswordControl.setErrors(null);
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      }
      // Ne faites rien si les valeurs correspondent et qu'il n'y a pas d'erreur mustMatch
      return null;
    };
  }

  onSubmit() {
    // Marquer tous les champs comme touchés pour déclencher les validations
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      // Cast la valeur du formulaire au type RegisterRequestInterface
      const registerData: RegisterRequestInterface = this.registerForm.value as RegisterRequestInterface;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          // Cast pour LoginRequestInterface également
          const loginData: LoginRequestInterface = {
            email: registerData.email, 
            password: registerData.password 
          };

          this.authService.login(loginData).subscribe({
            next: (response) => {
              this.router.navigate(['/check']);
            }
          });
          console.log('Inscription réussie');
        },
        error: (err) => {
          console.error("Erreur lors de l'inscription", err);
        }
      });
    } else {
        console.log('Formulaire invalide', this.registerForm.errors);
        // Vous pouvez ajouter une logique ici pour afficher des messages d'erreur à l'utilisateur
    }
  }
}
