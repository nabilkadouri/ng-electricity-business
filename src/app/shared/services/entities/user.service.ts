import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { UserInterface } from '../../models/UserInterface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly apiURL = environment.apiUrl;
 
  private userSubject = new BehaviorSubject<UserInterface| null>(null);
  public user$ = this.userSubject.asObservable();
  

  constructor(private http: HttpClient) {}

  getUser(): Observable<UserInterface> {
    //récupération du user connecté
    return this.http.get<UserInterface>(`${this.apiURL}/api/me`).pipe(
      //Transformation de la réponse et stockage des donnée dans le BehaviorSubject
      tap((user) =>this.userSubject.next(user)),
      //Si deux composant s'abonne au même moment une seul requête est exécutée
      shareReplay(1)
    );
  }

  //Méthode synchrone qui renvoie le contenu actuel du BehaviorSubject
  getUserFromCache(): UserInterface | null {
    return this.userSubject.getValue();
  }

  uploadProfilePicture(file: File): Observable<{ message: string; pictureUrl: string }> {
    const formData = new FormData();
    formData.append('pictureFile', file, file.name);

    return this.http.post<{ message: string; pictureUrl: string }>(`${this.apiURL}/api/me/upload-picture`, formData);
  }

  deleteProfilePicture(): Observable <{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiURL}/api/me/delete-picture`);
  }

  //Méthode qui permet d'effacer l'utilisateur contenu dans le BehaviorSubject
  clearUser() {
    this.userSubject.next(null);
  }

  //Méthode pour mettre à jour manuellement l'utilisateur dans le BehaviorSubject.
  updateUserInService(updatedUser: UserInterface): void {
    this.userSubject.next(updatedUser);
  }

  
  
}
