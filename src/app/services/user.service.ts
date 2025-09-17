import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRequestDTO, UserResponseDTO, UserUpdateRequestDTO } from '../models/user.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.API_URL);
  }

  getUserById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.API_URL}/${id}`);
  }

  updateUser(id: string, user: UserUpdateRequestDTO): Observable<UserResponseDTO> {
    return this.http.patch<UserResponseDTO>(`${this.API_URL}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
