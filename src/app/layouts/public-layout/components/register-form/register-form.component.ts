import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { LoginRequestInterface, RegisterRequestInterface } from '../../../../shared/models/AuthInterface';
import { NominatimService } from '../../../../shared/services/geocoding/nominatim.service';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {

  registerForm: FormGroup;
  isLoadingGeocoding: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthServiceService, private router: Router, private nominatimService: NominatimService) {
    this.registerForm = this.fb.group({
      name: new FormControl<string>('', {
        nonNullable: true, validators: Validators.required
      }),
      firstName: new FormControl<string>('', {
        nonNullable: true, validators: Validators.required
      }),
      email: new FormControl<string>('', {
        nonNullable: true, validators: [Validators.required, Validators.email]
      }),
      password: new FormControl<string>('', {
        nonNullable: true, validators: Validators.required
      }),
      confirmPassword: new FormControl<string>('', {
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
      latitude: [null],
      longitude: [null],
      phoneNumber: new FormControl('', {
        nonNullable: true, validators: [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]
      })
    }, { validators: this.mustMatch('password', 'confirmPassword') });
  }


  mustMatch(controlName: string, matchingControlName: string) {
    return (control: AbstractControl) => {
      const formGroup = control as FormGroup;
      const passwordControl = formGroup.controls[controlName];
      const confirmPasswordControl = formGroup.controls[matchingControlName];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && confirmPasswordControl.errors['mustMatch']) {
        confirmPasswordControl.setErrors(null);
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      }
      return null;
    };
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.isLoadingGeocoding = true;
      const { address, postaleCode, city } = this.registerForm.value;
      const fullAddress = `${address}, ${postaleCode}, ${city}`;

      this.nominatimService.getCoordinates(fullAddress).subscribe({
        next: (coordinates) => {
          this.isLoadingGeocoding = false;

          if (coordinates) {
            this.registerForm.patchValue({
              latitude: coordinates.latitude,
              longitude: coordinates.longitude
            });
            this.sendRegisterToBackend();
          } else {
            console.error('Impossible de récupérer les coordonnées pour l\'adresse fournie.')
          }
        },
        error: (error) => {
          this.isLoadingGeocoding = false;
          console.error('Erreur lors du géocodage:', error);
        }
      });
    } else {
      console.log('Formulaire invalide', this.registerForm.errors);
    }
  }

  private sendRegisterToBackend(): void {
    const registerData: RegisterRequestInterface = this.registerForm.value as RegisterRequestInterface;
    this.authService.register(registerData).subscribe({
      next: (response) => {
        const loginData: LoginRequestInterface = {
          email: registerData.email,
          password: registerData.password
        };

        this.authService.login(loginData).subscribe({
          next: (response) => {
            this.router.navigate(['/check']);
            this.registerForm.reset();
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de l'inscription", err);
      }
    });
  }
}
