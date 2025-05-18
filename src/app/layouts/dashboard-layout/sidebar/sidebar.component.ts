import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/entities/user.service';
import { UserInterface } from '../../../shared/models/UserInterface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../../shared/services/auth-service.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthServiceService)
  user!: UserInterface ;


  ngOnInit(): void {
  const token = this.authService.getToken();
    if (token) {
      this.userData();
    } else {
      console.log('Pas de token trouvé, les données utilisateur ne seront pas chargées.');
    }
  }

  userData(){
    this.userService.getUser().subscribe((data) => {
      this.user = data;
      console.log(this.user);
      
    });
    }
  }


