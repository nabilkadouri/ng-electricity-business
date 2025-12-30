import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { PictureDetailsInterface, UserEmailUpdateInterface, UserResponseInterface } from '../../models/UserInterface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly apiUrl = environment.apiUrl;
 
  private userSubject = new BehaviorSubject<UserResponseInterface| null>(null);
  public user$: Observable<UserResponseInterface | null> = this.userSubject.asObservable();
  

  constructor(private http: HttpClient) {}

  getConnectedUserFromApi(): Observable<UserResponseInterface> {
    return this.http.get<UserResponseInterface>(`${this.apiUrl}/api/account/me`).pipe(
      // Met à jour le BehaviorSubject avec les données reçues de l'API.
      tap((userResponse) => this.userSubject.next(userResponse)),
      shareReplay(1)
    );
  }

  //Méthode qui renvoie le contenu actuel du BehaviorSubject
  //Permet de récuperer le user sans refaire de requête HTTP
  getUserFromCache(): UserResponseInterface | null {
    return this.userSubject.getValue();
  }


  //Méthode qui permet d'effacer l'utilisateur contenu dans le BehaviorSubject
  clearUser() {
    this.userSubject.next(null);
  }


  //Méthode pour mettre à jour manuellement l'utilisateur dans le BehaviorSubject.
  updateUserInService(updatedUser: UserResponseInterface): void {
    this.userSubject.next(updatedUser);
  }


  uploadProfilePicture(userId: number, file: File, altText: string,
    isMain: boolean = true): Observable<PictureDetailsInterface> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    if((altText.trim().length === 0)) {
      formData.append("alt", altText)
    }
    formData.append("isMain", String(isMain))

    return this.http.post<PictureDetailsInterface>(`${this.apiUrl}/api/account/${userId}/uploadProfilePicture`, formData);
  }



  updateUserEmail(id: number, emailUpdate: UserEmailUpdateInterface): Observable<UserResponseInterface> {
    return this.http.patch<UserResponseInterface>(`${this.apiUrl}/api/account/${id}/email`, emailUpdate).pipe(
      tap((updatedUser)=> {
        if(this.userSubject.getValue()?.id === updatedUser.id) {
          this.userSubject.next(updatedUser)
        }
      })
    );
  }


  updatePassword(userId: number, payload: any) {
    return this.http.patch(`${this.apiUrl}/api/account/${userId}/password`, payload,);
  }
  


  deleteUser(id: number):Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/account/${id}`);
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }  
}
