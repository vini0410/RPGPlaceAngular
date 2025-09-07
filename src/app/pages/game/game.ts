import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from '../../services/websocket.service';
import {
  CharacterResponseDTO,
  CharacterUpdateDTO,
} from '../../models/character.model';
import { fromEvent, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TableService } from '../../services/table.service';
import { UserResponseDTO } from '../../models/user.model';
import { TableResponseDTO } from '../../models/table.model';
import { exhaustMap, takeUntil } from 'rxjs/operators';

export interface DrawEventDTO {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  size: number;
}

export interface ChatMessage {
  senderId: string;
  senderName: string;
  characterName: string;
  text: string;
  timestamp: Date;
}

export interface ChatMessageDTO {
  text: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class GameComponent implements OnInit, OnDestroy, AfterViewInit {
  private webSocketService = inject(WebSocketService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private tableService = inject(TableService);

  private subscriptions = new Subscription();
  tableId: string | null = null;
  currentUser: UserResponseDTO | null = null;
  table: TableResponseDTO | null = null;

  characters = signal<CharacterResponseDTO[]>([]);

  // Whiteboard properties
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  drawColor = '#000000';
  brushSize = 5;

  // Chat properties
  messages: ChatMessage[] = [];
  newMessage = '';
  currentUserId: string | null = null;

  // Responsive properties
  isLeftSidebarOpen = false;
  isRightSidebarOpen = false;
  isSmallScreen = false;

  ngOnInit(): void {
    this.tableId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authService.getCurrentUser();

    if (!this.tableId) {
      console.error('Table ID is missing!');
      return;
    }

    this.tableService.getTableById(this.tableId).subscribe((table) => {
      this.table = table;
    });

    this.currentUserId = this.currentUser ? this.currentUser.id : null;

    this.subscriptions.add(
      this.webSocketService.connect().subscribe((isConnected) => {
        if (isConnected) {
          this.setupSubscriptions();
          this.fetchAllCharacters();
        }
      })
    );

    this.checkScreenSize();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.setupCanvasDrawing();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.webSocketService.disconnect();
  }

  canEdit(character: CharacterResponseDTO): boolean {
    if (!this.currentUser || !this.table) {
      return false;
    }
    return (
      this.currentUser.id === this.table.masterId ||
      this.currentUser.id === character.userId
    );
  }

  private setupSubscriptions(): void {
    if (!this.tableId) return;

    // Character subscriptions
    const listTopic = `/user/queue/table/${this.tableId}/characters`;
    this.subscriptions.add(
      this.webSocketService.subscribe<CharacterResponseDTO[]>(listTopic).subscribe(characters => {
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

    // Whiteboard subscription
    const drawTopic = `/topic/table/${this.tableId}/draw`;
    this.subscriptions.add(
      this.webSocketService.subscribe<DrawEventDTO>(drawTopic).subscribe(event => {
        this.drawOnCanvas(event.x1, event.y1, event.x2, event.y2, event.color, event.size);
      })
    );

    // Chat subscription
    const chatTopic = `/topic/table/${this.tableId}/chat`;
    this.subscriptions.add(
      this.webSocketService.subscribe<ChatMessage>(chatTopic).subscribe(message => {
        this.messages.push(message);
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
      intelligence: Number(character.intelligence),
    };

    const destination = `/app/table/${this.tableId}/character/update`;
    this.webSocketService.send(destination, updateDTO);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private setupCanvasDrawing(): void {
    const canvas = this.canvasRef.nativeElement;

    const mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown');
    const mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove');
    const mouseUp$ = fromEvent<MouseEvent>(canvas, 'mouseup');
    const mouseLeave$ = fromEvent<MouseEvent>(canvas, 'mouseleave');

    let lastPos: { x: number; y: number } | null = null;

    const draw$ = mouseDown$.pipe(
      exhaustMap(() => {
        lastPos = null; // Reset last position on new drag
        return mouseMove$.pipe(takeUntil(mouseUp$), takeUntil(mouseLeave$));
      })
    );

    draw$.subscribe(event => {
      const currentPos = { x: event.offsetX, y: event.offsetY };
      if (lastPos) {
        this.drawOnCanvas(lastPos.x, lastPos.y, currentPos.x, currentPos.y, this.drawColor, this.brushSize);
        this.sendDrawEvent(lastPos.x, lastPos.y, currentPos.x, currentPos.y, this.drawColor, this.brushSize);
      }
      lastPos = currentPos;
    });
  }

  private drawOnCanvas(x1: number, y1: number, x2: number, y2: number, color: string, size: number): void {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = size;
    this.ctx.lineCap = 'round';
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private sendDrawEvent(x1: number, y1: number, x2: number, y2: number, color: string, size: number): void {
    if (!this.tableId) return;

    const drawEvent: DrawEventDTO = { x1, y1, x2, y2, color, size };
    const destination = `/app/table/${this.tableId}/draw`;
    this.webSocketService.send(destination, drawEvent);
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.tableId) {
      const chatMessage: ChatMessageDTO = {
        text: this.newMessage,
      };
      const destination = `/app/table/${this.tableId}/chat/send`;
      this.webSocketService.send(destination, chatMessage);
      this.newMessage = '';
    }
  }

  toggleLeftSidebar(): void {
    if (this.isSmallScreen) {
      this.isLeftSidebarOpen = !this.isLeftSidebarOpen;
    }
  }

  toggleRightSidebar(): void {
    if (this.isSmallScreen) {
      this.isRightSidebarOpen = !this.isRightSidebarOpen;
    }
  }

  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 1920; // fullhd breakpoint
    if (!this.isSmallScreen) { // On large screens, sidebars are always open
      this.isLeftSidebarOpen = true;
      this.isRightSidebarOpen = true;
    } else { // On small screens, sidebars are closed by default
      this.isLeftSidebarOpen = false;
      this.isRightSidebarOpen = false;
    }
  }
}
