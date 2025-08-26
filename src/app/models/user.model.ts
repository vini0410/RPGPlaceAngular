export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
}
