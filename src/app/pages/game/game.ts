import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableService } from '../../services/table.service';
import { TableResponseDTO } from '../../models/table.model';
import { CharacterResponseDTO } from '../../models/character.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game.html',
  styleUrls: ['./game.css']
})
export class GameComponent implements OnInit {

  table: TableResponseDTO | null = null;
  characters: CharacterResponseDTO[] = [];

  constructor(
    private route: ActivatedRoute,
    private tableService: TableService
  ) { }

  ngOnInit(): void {
    const tableId = this.route.snapshot.paramMap.get('id');
    if (tableId) {
      this.loadTableDetails(tableId);
      this.loadCharacters(tableId);
    }
  }

  loadTableDetails(id: string) {
    this.tableService.getTableById(id).subscribe(table => {
      this.table = table;
    });
  }

  loadCharacters(tableId: string) {
    this.tableService.getTableCharacters(tableId).subscribe(characters => {
      this.characters = characters;
    });
  }
}