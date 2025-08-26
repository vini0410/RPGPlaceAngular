import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequestDTO } from '../models/auth.model';
import { UserResponseDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = '/api/auth';

  constructor(private http: HttpClient) {}

  register(registerRequest: RegisterRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(
      `${this.API_URL}/register`,
      registerRequest
    );
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, loginRequest);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/logout`, {});
  }
}
