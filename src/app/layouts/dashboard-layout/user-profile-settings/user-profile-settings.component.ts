import { Component, inject, input, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { UserInterface } from '../../../shared/models/UserInterface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.development';
import { finalize} from 'rxjs';


@Component({
  selector: 'app-user-profile-settings',
  imports: [CommonModule,],
  templateUrl: './user-profile-settings.component.html',
  styleUrl: './user-profile-settings.component.css'
})
export class UserProfileSettingsComponent implements OnInit{
  userService = inject(UserService);
  user!: UserInterface;
  readonly defaultProfilePicture = 'http://localhost:8000/images/default_avatar.png';

  isLoading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if(user) {
        this.user = user;
        console.log("Donnée user profil: ", user);
        if (this.user.picture && !this.user.picture.startsWith('http') && this.user.picture !== this.defaultProfilePicture) {
          this.user.picture = `http://localhost:8000/${this.user.picture}`;
        } else if (!this.user.picture) {
          this.user.picture = this.defaultProfilePicture;
        }
        
      }else {
        console.log("Erreur lors de la récupératin des données utilisateur");
        this.errorMessage = "Impossible de charger les données utilisateur.";
      }
    })
  }

  onFileSelected(event: Event): void{
    this.errorMessage = null;
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadPicture(file);
    }
  }

  private uploadPicture(file: File): void {
    this.isLoading = true; 
    this.errorMessage = null;
    this.userService.uploadProfilePicture(file).pipe(
      finalize(() => {
        this.isLoading = false; 
      })
    ).subscribe({
      next: (response) => {
        if (response && response.pictureUrl) {
          const updatedUser: UserInterface = { ...this.user, picture: response.pictureUrl };
          this.userService.updateUserInService(updatedUser);
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

  deletePicture(): void {
    if (!this.user?.picture || this.user.picture === this.defaultProfilePicture) {
      this.errorMessage = "Aucun photo de profil à supprimer";
      return;
    }

    if(!confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.userService.deleteProfilePicture().pipe( 
      finalize(() => {
        this.isLoading = false; 
      })
    ).subscribe({
      next: () => {
        const updatedUser: UserInterface = { ...this.user, picture: this.defaultProfilePicture };
        this.userService.updateUserInService(updatedUser); 
        console.log('Photo de profil supprimée avec succès !');
      },
      error: (error: any) => {
        this.errorMessage = 'Une erreur est survenue lors de la suppression de la photo. Veuillez réessayer.';
        console.error('Erreur lors de la suppression (gérée par intercepteur):', error);
      }
    });
  }

}
