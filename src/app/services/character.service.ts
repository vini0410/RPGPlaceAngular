import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CharacterRequestDTO,
  CharacterResponseDTO,
} from '../models/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly API_URL = '/api/characters';

  constructor(private http: HttpClient) {}

  createCharacter(
    character: CharacterRequestDTO
  ): Observable<CharacterResponseDTO> {
    return this.http.post<CharacterResponseDTO>(this.API_URL, character);
  }

  getAllCharacters(): Observable<CharacterResponseDTO[]> {
    return this.http.get<CharacterResponseDTO[]>(this.API_URL);
  }

  getCharacterById(id: string): Observable<CharacterResponseDTO> {
    return this.http.get<CharacterResponseDTO>(`${this.API_URL}/${id}`);
  }

  updateCharacter(
    id: string,
    character: CharacterRequestDTO
  ): Observable<CharacterResponseDTO> {
    return this.http.put<CharacterResponseDTO>(
      `${this.API_URL}/${id}`,
      character
    );
  }

  deleteCharacter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
