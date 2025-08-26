export interface TableResponseDTO {
  id: string;
  title: string;
  rulebook: string;
  accessCode: string;
  masterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableRequestDTO {
  title: string;
  rulebook: string;
  accessCode: string;
  masterId: string;
}

export interface JoinRequestDTO {
  accessCode: string;
}
