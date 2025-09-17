import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RegisterRequestDTO } from '../models/auth.model';
import { LoginResponseDTO } from '../models/login.model';
import { UserResponseDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';
  private isAuthenticatedSignal = signal<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor(private http: HttpClient) {
    this.isAuthenticatedSignal.set(!!this.getToken());
  }

  register(registerRequest: RegisterRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(
      `${this.API_URL}/register`,
      registerRequest
    );
  }

  login(loginRequest: any): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.API_URL}/login`, loginRequest).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.isAuthenticatedSignal.set(true);
        }
      })
    );
  }

  logout(): Observable<any> {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSignal.set(false);
    return this.http.post<any>(`${this.API_URL}/logout`, {});
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getCurrentUser(): UserResponseDTO | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: UserResponseDTO): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
