import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiListResponse } from '../../models/ApiResponse';
import { UserInterface } from '../../models/UserInterface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly apiURL = environment.apiUrl;
  public users = signal<UserInterface[]>([]);

  constructor(private http: HttpClient) { }

  getUsers():Observable<ApiListResponse<UserInterface>>{
    return this.http.get<ApiListResponse<UserInterface>>(`${this.apiURL}/users`)
  }

  getUserById(id: number | string): Observable<UserInterface> {
    return this.http.get<UserInterface>(`${this.apiURL}/users/${id}`);
  }
}
