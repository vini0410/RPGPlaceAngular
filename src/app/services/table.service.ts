import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CharacterRequestDTO,
  CharacterResponseDTO,
} from '../models/character.model';
import {
  JoinRequestDTO,
  TableRequestDTO,
  TableResponseDTO,
} from '../models/table.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  private readonly API_URL = `${environment.apiUrl}/tables`;

  constructor(private http: HttpClient) {}

  createTable(table: TableRequestDTO): Observable<TableResponseDTO> {
    return this.http.post<TableResponseDTO>(this.API_URL, table);
  }

  getAllTables(): Observable<TableResponseDTO[]> {
    return this.http.get<TableResponseDTO[]>(this.API_URL);
  }

  getOwnedTables(): Observable<TableResponseDTO[]> {
    return this.http.get<TableResponseDTO[]>(`${this.API_URL}/owned`);
  }

  getJoinedTables(): Observable<TableResponseDTO[]> {
    return this.http.get<TableResponseDTO[]>(`${this.API_URL}/joined`);
  }

  joinTable(joinRequest: JoinRequestDTO): Observable<TableResponseDTO> {
    return this.http.post<TableResponseDTO>(
      `${this.API_URL}/join`,
      joinRequest
    );
  }

  getTableById(id: string): Observable<TableResponseDTO> {
    return this.http.get<TableResponseDTO>(`${this.API_URL}/${id}`);
  }

  updateTable(id: string, table: TableRequestDTO): Observable<TableResponseDTO> {
    return this.http.put<TableResponseDTO>(`${this.API_URL}/${id}`, table);
  }

  deleteTable(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getTableCharacters(tableId: string): Observable<CharacterResponseDTO[]> {
    return this.http.get<CharacterResponseDTO[]>(
      `${this.API_URL}/${tableId}/characters`
    );
  }

  createCharacterForTable(
    tableId: string,
    character: CharacterRequestDTO
  ): Observable<CharacterResponseDTO> {
    return this.http.post<CharacterResponseDTO>(
      `${this.API_URL}/${tableId}/characters`,
      character
    );
  }
}
