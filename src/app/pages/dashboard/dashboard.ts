import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../services/table.service';
import { CharacterService } from '../../services/character.service';
import { TableResponseDTO } from '../../models/table.model';
import { CharacterResponseDTO } from '../../models/character.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  tables: TableResponseDTO[] = [];
  characters: CharacterResponseDTO[] = [];

  constructor(
    private tableService: TableService,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    this.loadTables();
    this.loadCharacters();
  }

  loadTables() {
    this.tableService.getAllTables().subscribe((tables) => {
      this.tables = tables;
    });
  }

  loadCharacters() {
    this.characterService.getAllCharacters().subscribe((characters) => {
      this.characters = characters;
    });
  }
}
