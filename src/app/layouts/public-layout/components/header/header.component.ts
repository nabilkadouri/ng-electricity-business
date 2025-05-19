import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthServiceService } from '../../../../shared/services/auth-service.service';
import { UserService } from '../../../../shared/services/entities/user.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

userService  = inject(UserService);
userId: number | null = null;
router = inject(Router);
authService = inject(AuthServiceService);

// Methode qui permet de fermer le menu au click sur un lien en mode mobile
ngAfterViewInit() {
  const menuBurger = document.getElementById('navbar-sticky');
  const links = menuBurger?.querySelectorAll('a');

  links?.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        menuBurger?.classList.add('hidden');
      }
    });
  });
}

// Methode qui permet de fermer/ouvrir menu burger
toggleMenu() {
  const menu = document.getElementById('navbar-sticky');
  menu?.classList.toggle('hidden');
}

}
