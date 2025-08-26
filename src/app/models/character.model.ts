export interface CharacterResponseDTO {
  id: string;
  name: string;
  health: number;
  mana: number;
  strength: number;
  agility: number;
  intelligence: number;
  userId: string;
  tableId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterRequestDTO {
  name: string;
  health: number;
  mana: number;
  strength: number;
  agility: number;
  intelligence: number;
  userId: string;
  tableId: string;
}
