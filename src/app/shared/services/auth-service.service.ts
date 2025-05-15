import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CodeCheckRequest, IToken, LoginRequest, LoginSuccessResponse, RegisterRequest } from '../models/AuthInterface';
import { UserInterface } from '../models/UserInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private apiURL = environment.apiUrl;
  private tokenKey = 'authToken';
  isLoggedIn = signal<boolean>(!!this.getToken());

  constructor(private http: HttpClient, private router: Router) { }

  register(credentials: RegisterRequest):Observable<UserInterface>{
    return this.http.post<UserInterface>(`${this.apiURL}/api/users`,credentials);
  }

  login(credentials: LoginRequest):Observable<LoginSuccessResponse> {
    return this.http.post<LoginSuccessResponse>(`${this.apiURL}/login`,credentials,{withCredentials: true, headers: {"Content-Type": "application/json"}});
  }

  checkCode(codeCheck: CodeCheckRequest):Observable<IToken>{
    return this.http.post<IToken>(`${this.apiURL}/login/check`, codeCheck, {withCredentials: true, headers: {"Content-Type": "application/json"}});
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  
  getToken(): string {
      return localStorage.getItem(this.tokenKey) || '';
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
    this.router.navigate(['/'])
  }
}
