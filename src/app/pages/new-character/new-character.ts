import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableService } from '../../services/table.service';
import { CharacterService } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';
import { TableResponseDTO } from '../../models/table.model';
import { UserResponseDTO } from '../../models/user.model';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-new-character',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-character.html',
  styleUrls: ['./new-character.css']
})
export class NewCharacterComponent implements OnInit {
  table: TableResponseDTO | null = null;
  characterForm: FormGroup;
  currentUser: UserResponseDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tableService: TableService,
    private characterService: CharacterService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      health: [100, Validators.required],
      mana: [100, Validators.required],
      strength: [10, Validators.required],
      agility: [10, Validators.required],
      intelligence: [10, Validators.required]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.route.queryParams.subscribe(params => {
      const tableCode = params['tableCode'];
      if (tableCode) {
        this.tableService.joinTable({ accessCode: tableCode }).subscribe({
          next: table => {
            this.table = table;
          },
          error: () => {
            this.notificationService.showError('Table not found!');
            this.router.navigate(['/dashboard']);
          }
        });
      }
    });
  }

  createCharacter(): void {
    if (this.characterForm.valid && this.table && this.currentUser) {
      const characterData = {
        ...this.characterForm.value,
        userId: this.currentUser.id,
        tableId: this.table.id
      };

      this.characterService.createCharacter(characterData).subscribe(character => {
        this.router.navigate(['/game', this.table?.id]);
      });
    }
  }
}