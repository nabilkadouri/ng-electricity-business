import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { CommonModule } from '@angular/common';
import { finalize, Subject, takeUntil} from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserResponseInterface } from '../../../shared/models/UserInterface';


@Component({
  selector: 'app-user-profile-settings',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-profile-settings.component.html',
  styleUrl: './user-profile-settings.component.css'
})
export class UserProfileSettingsComponent implements OnInit, OnDestroy{
  emailForm!: FormGroup ;
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);

  user!: UserResponseInterface;
  

  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isEditingEmail = false;

  showPasswordForm = false;

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  passwordSuccess: string | null = null;
  passwordError: string | null = null;


  private destroy$ = new Subject<void>();

  get emailControl() {
    return this.emailForm.get('email') as FormControl;
  }


  ngOnInit(): void {
    this.userService.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe((user) => {
      if(user) {
        this.user = user;
        this.emailForm =this.formBuilder.group({
          id: [this.user.id || ''],
          email: [this.user.email  || '',[Validators.required, Validators.email]]
        });
        this.errorMessage = null;
      }else {
        this.errorMessage = "Impossible de charger les données utilisateur.";
      }
    });
    if (!this.emailForm) {
      this.emailForm = this.formBuilder.group({
        id: [''],
        email: ['', [Validators.required, Validators.email]]
      });
    }
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  toggleEditEmail(): void {
    this.isEditingEmail = !this.isEditingEmail;
    if (this.isEditingEmail) {
      this.emailForm.patchValue({ email: this.user.email });
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
  }
  

  onSubmit(): void {
    if (this.emailForm.invalid) return;
    if (!this.user || !this.user.id){
      this.errorMessage = "ID utilisateur non disponible pour la mise à jour.";
      return;
    }

    const id = this.user.id;
    const newEmail = this.emailForm.value.email;
    

    this.userService.updateUserEmail(id,{ email: newEmail }).subscribe({
      next: (updatedUser: UserResponseInterface) => {
        this.user = updatedUser;
        this.userService.updateUserInService(updatedUser);
        this.successMessage = 'Email mis à jour avec succès.';
        this.errorMessage = null;
        this.isEditingEmail = false;
      },
      error: (error) => {
        this.errorMessage = 'Une erreur est survenue lors de la mise à jour de l\'email.';
        this.successMessage = null;
        console.error('Erreur lors de la mise à jour de l\'email:', error);
      }
    });
  }

  onFileSelected(event: Event): void{
    this.errorMessage = null;
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadPicture(this.user.id,file);
    }else {
      this.errorMessage = "Impossible d'uploader le photo: ID utilisateur manquant.";
    }
  }

  private uploadPicture(userId: number, file: File): void {
    this.isLoading = true; 
    this.errorMessage = null;
    const altText = `Photo de profil de ${this.user?.firstName || ''} ${this.user?.name || ''}`;
    const isMain = true;

    this.userService.uploadProfilePicture(userId,file,altText,isMain).pipe(
      finalize(() => {
        this.isLoading = false; 
      })
    ).subscribe({
      next: (response) => {
        if (response && response.src) {
          const updatedUser: UserResponseInterface = { 
            ...this.user,
            profilePicture: {
              src: response.src,
              alt: response.alt,
              main: response.main
            }
          };

          this.userService.updateUserInService(updatedUser);
          this.successMessage = 'Photo mise à jour avec succès !';
          console.log('Photo mise à jour avec succès !');
        } else {
          this.errorMessage = 'Problème: Le serveur n\'a pas renvoyé l\'adresse de la photo.';
        }
      },
      error: (error: any) => {
        this.errorMessage = 'Une erreur est survenue lors de l\'envoi de la photo. Veuillez réessayer.';
        console.error('Erreur lors de l\'upload (gérée par intercepteur):', error);
      }
    });
  }

  updatePassword() {

    this.passwordError = null;
    this.passwordSuccess = null;
  
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = "Tous les champs sont obligatoires.";
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = "Les nouveaux mots de passe ne correspondent pas.";
      return;
    }
  
    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };
  
    this.userService.updatePassword(this.user.id, payload).subscribe({
      next: () => {
        this.passwordSuccess = "Mot de passe mis à jour avec succès.";
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: () => {
        this.passwordError = "Ancien mot de passe incorrect.";
      }
    });
  }

  
  deleteAccount() {
    if (!this.user?.id) {
      alert("Erreur : ID utilisateur introuvable.");
      return;
    }
  
    const confirmation = confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est définitive."
    );
  
    if (!confirmation) return;
  
    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        // Déconnexion locale
        this.userService.logout();
  
        // Redirection
        window.location.href = "/login";
      },
      error: (err) => {
        console.error("Erreur lors de la suppression du compte :", err);
        alert("Une erreur est survenue lors de la suppression du compte.");
      }
    });
  }
  
}
