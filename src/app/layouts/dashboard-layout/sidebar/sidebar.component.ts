import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { UserInterface } from '../../../shared/models/UserInterface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthServiceService);
  user!: UserInterface;
  isSidebarOpen: boolean = false;

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.userService.getUser().subscribe({
        next: (user) => (this.user = user),
        error: () => console.warn("Echec du chargement de l'utilisateur"),
      });
    }
  }

  
  // fermer et ouvrir le menu sidebar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Methode qui permet de fermer le menu sidebar au click sur un lien en mode mobile
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
