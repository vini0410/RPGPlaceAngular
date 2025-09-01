import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableService } from '../../services/table.service';
import { CharacterService } from '../../services/character.service';
import { TableResponseDTO } from '../../models/table.model';
import { CharacterResponseDTO } from '../../models/character.model';
import { Modal } from '../../components/modal/modal';
import { CreateTableModal } from '../../components/create-table-modal/create-table-modal';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Modal, CreateTableModal, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  ownedTables: TableResponseDTO[] = [];
  joinedTables: TableResponseDTO[] = [];
  myCharacters: CharacterResponseDTO[] = [];
  isModalOpen = false;
  isCreateTableModalOpen = false;
  userName: string | null = null;

  constructor(
    private tableService: TableService,
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTables();
    this.loadCharacters();
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.name;
    }
  }

  loadTables() {
    this.tableService.getOwnedTables().subscribe((tables) => {
      this.ownedTables = tables;
    });
    this.tableService.getJoinedTables().subscribe((tables) => {
      this.joinedTables = tables;
    });
  }

  loadCharacters() {
    this.characterService.getMyCharacters().subscribe((characters) => {
      this.myCharacters = characters;
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  createCharacter(tableCode: string) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.log('createCharacter: Current user is not logged in.');
      // Handle case where user is not logged in
      return;
    }

    this.tableService.joinTable({ accessCode: tableCode }).subscribe((table) => {
      const characterData = {
        name: 'New Character',
        health: 100,
        mana: 100,
        strength: 10,
        agility: 10,
        intelligence: 10,
        userId: currentUser.id,
        tableId: table.id,
      };

      this.characterService.createCharacter(characterData).subscribe(() => {
        this.loadCharacters();
        this.closeModal();
      });
    });
  }

  openCreateTableModal() {
    this.isCreateTableModalOpen = true;
  }

  closeCreateTableModal() {
    this.isCreateTableModalOpen = false;
  }

  createTable(tableName: string) {
    console.log('createTable method called with table name:', tableName);
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.log('createTable: Current user is not logged in.');
      // Handle case where user is not logged in
      return;
    }

    const tableData = {
      title: tableName,
      rulebook: 'D&D 5e',
      accessCode: Math.random().toString(36).substring(2, 8),
      masterId: currentUser.id,
    };

    this.tableService.createTable(tableData).subscribe(() => {
      this.loadTables();
      this.closeCreateTableModal();
    });
  }
}
