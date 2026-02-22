// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

export const ADMIN_EMAILS = [
  'nour@tawsila.com',
  'salma@tawsila.com',
  'admin@tawsila.com'
];

@Injectable({ providedIn: 'root' })
export class AuthService {  // ✅ renommer Auth → AuthService
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8082/api';

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.saveSession(res))
    );
  }

  register(data: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAdminEmail(email: string): boolean {
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('email', res.email);
    localStorage.setItem('nom', res.nom);
    localStorage.setItem('prenom', res.prenom);
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  getEmail(): string | null { return localStorage.getItem('email'); }
  getNom(): string | null { return localStorage.getItem('nom'); }
  getPrenom(): string | null { return localStorage.getItem('prenom'); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin(): boolean { return this.getRole() === 'ADMIN'; }
  isClient(): boolean { return this.getRole() === 'CLIENT'; }
  isCoursier(): boolean { return this.getRole() === 'COURSIER'; }

  redirectAfterLogin() {
    const role = this.getRole();
    if (role === 'ADMIN') this.router.navigate(['/admin/profile']);
    else if (role === 'CLIENT') this.router.navigate(['/client/profile']);
    else if (role === 'COURSIER') this.router.navigate(['/coursier/profile']);
    else this.router.navigate(['/login']);
  }
}