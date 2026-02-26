export type Role = 'ADMIN' | 'CLIENT' | 'COURSIER' | 'MERCHANT'; // ✅

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  address: string;
  city: string;         // ✅
  codePostal: string;   // ✅
  telephone: string;
  imageUrl: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  role: Role;
  email: string;
  nom: string | null;
  prenom: string | null;
  nomEntreprise: string | null; // ✅ pour MERCHANT
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
  city: string;         // ✅
  codePostal: string;   // ✅
  telephone: string;
  role: Role;
  imageUrl: string;
}

export interface MerchantRegisterRequest { // ✅ nouveau
  nomEntreprise: string;
  typeActivite: string;
  address: string;
  city: string;
  codePostal: string;
  telephone: string;
  email: string;
  motDePasse: string;
  confirmerMotDePasse: string;
}
