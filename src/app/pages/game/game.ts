import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../../services/websocket.service';
import { CharacterResponseDTO, CharacterUpdateDTO } from '../../models/character.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent implements OnInit, OnDestroy {
  private webSocketService = inject(WebSocketService);
  private route = inject(ActivatedRoute);

  private subscriptions = new Subscription();
  tableId: string | null = null;

  characters = signal<CharacterResponseDTO[]>([]);

  ngOnInit(): void {
    this.tableId = this.route.snapshot.paramMap.get('id');
    if (!this.tableId) {
      console.error('Table ID is missing!');
      return;
    }

    this.subscriptions.add(
      this.webSocketService.connect().subscribe(isConnected => {
        if (isConnected) {
          this.setupSubscriptions();
          this.fetchAllCharacters();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.webSocketService.disconnect();
  }

  private setupSubscriptions(): void {
    if (!this.tableId) return;

    const listTopic = `/user/queue/table/${this.tableId}/characters`;
    this.subscriptions.add(
      this.webSocketService.subscribe<CharacterResponseDTO[]>(listTopic).subscribe(characters => {
        console.log('Received characters:', characters);
        this.characters.set(characters);
      })
    );

    const updateTopic = `/topic/table/${this.tableId}/characters`;
    this.subscriptions.add(
      this.webSocketService.subscribe<CharacterResponseDTO>(updateTopic).subscribe(updatedChar => {
        this.characters.update(chars =>
          chars.map(c => c.id === updatedChar.id ? updatedChar : c)
        );
      })
    );
  }

  private fetchAllCharacters(): void {
    if (!this.tableId) return;
    const destination = `/app/table/${this.tableId}/characters/getall`;
    this.webSocketService.send(destination, {});
  }

  onAttributeChange(character: CharacterResponseDTO): void {
    if (!this.tableId) return;

    const updateDTO: CharacterUpdateDTO = {
      id: character.id,
      name: character.name,
      health: Number(character.health),
      mana: Number(character.mana),
      strength: Number(character.strength),
      agility: Number(character.agility),
      intelligence: Number(character.intelligence)
    };

    const destination = `/app/table/${this.tableId}/character/update`;
    this.webSocketService.send(destination, updateDTO);
  }
}
