import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CodeCheckRequestInterface, IToken, LoginInitialResponse, LoginRequestInterface, LoginResponseInterface, RegisterRequestInterface} from '../models/AuthInterface';
import { Observable, tap } from 'rxjs';
import { UserService } from './entities/user.service';
import { UserResponseInterface } from '../models/UserInterface';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiURL = environment.apiUrl;
  private accessToken = 'authToken';
  private refreshToken = 'refreshToken'
  private userService = inject(UserService);

  isLoggedIn = signal<boolean>(!!this.getAccessToken());

  private tempUserEmail: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  register(credentials: RegisterRequestInterface):Observable<UserResponseInterface>{
    return this.http.post<UserResponseInterface>(`${this.apiURL}/api/auth/register`,credentials);
  }

  login(credentials: LoginRequestInterface):Observable<LoginInitialResponse> {
    return this.http.post<LoginInitialResponse>(`${this.apiURL}/api/auth/login`,credentials).pipe(
      tap(response => {
        this.setTempUserEmail(credentials.email)
        console.log('Login initial réussi : ', response.message);
      })
    );
  }
  // Méthode ajouter l'email temporaire
  setTempUserEmail(email: string): void {
   this.tempUserEmail = email;
  }

  //Méthode pour récupérer l'email temporaire
  getTempUserEmail(): string | null {
    return this.tempUserEmail;
  }

  // Méthode pour nettoyer l'email temporaire après utilisation ou échec
  clearTempUserEmail(): void {
    this.tempUserEmail = null;
  }

   checkCode(codeCheck: CodeCheckRequestInterface): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>(`${this.apiURL}/api/auth/login/check`, codeCheck).pipe(
      tap(response => {
        // Stockage des tokens après une vérification réussie
        this.saveAccessToken(response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.isLoggedIn.set(true);
        this.clearTempUserEmail();

        this.userService.getConnectedUserFromApi().subscribe({
          next:() => console.log('Détails de l\'utilisateur récupérés et mis en cache après connexion.'),
        error: err => console.error('Échec de la récupération des détails utilisateur après connexion :', err)
        });
      })
    );
  }

  saveAccessToken(token: string): void {
    localStorage.setItem(this.accessToken, token);
  }
  
  getAccessToken(): string | null {
    return localStorage.getItem(this.accessToken);
  }
  
  logout(): void {
    localStorage.removeItem(this.accessToken);
    localStorage.removeItem(this.refreshToken)
    this.isLoggedIn.set(false);
    this.userService.clearUser();
    this.router.navigate(['/'])
  }

  isLogged(): boolean {
    return this.isLoggedIn();
  }
}
