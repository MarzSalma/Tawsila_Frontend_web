export type Role = 'ADMIN' | 'CLIENT' | 'COURSIER';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  address: string;
  telephone: string;
  imageUrl: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  role: Role;
  email: string;
  nom: string;
  prenom: string;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  address: string;
  telephone: string;
  role: Role;
  imageUrl: string;
}