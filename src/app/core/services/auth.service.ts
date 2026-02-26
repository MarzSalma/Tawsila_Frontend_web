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
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8082/api';

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // ✅ multipart/form-data pour CLIENT / COURSIER / ADMIN
  register(data: RegisterRequest, image?: File) {
    const formData = new FormData();
    formData.append('nom',        data.nom);
    formData.append('prenom',     data.prenom);
    formData.append('email',      data.email);
    formData.append('motDePasse', data.motDePasse);
    formData.append('address',    data.address    || '');
    formData.append('city',       data.city       || '');
    formData.append('codePostal', data.codePostal || '');
    formData.append('telephone',  data.telephone  || '');
    formData.append('role',       data.role);
    if (image) formData.append('image', image);

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, formData).pipe(
      tap(res => this.saveSession(res))
    );
  }

  // ✅ multipart/form-data pour MERCHANT
  registerMerchant(data: {
    nomEntreprise: string;
    typeActivite: string;
    address: string;
    city: string;
    codePostal: string;
    telephone: string;
    email: string;
    motDePasse: string;
    confirmerMotDePasse: string;
  }, image?: File) {
    const formData = new FormData();
    formData.append('nomEntreprise',       data.nomEntreprise);
    formData.append('typeActivite',        data.typeActivite);
    formData.append('address',             data.address    || '');
    formData.append('city',                data.city       || '');
    formData.append('codePostal',          data.codePostal || '');
    formData.append('telephone',           data.telephone  || '');
    formData.append('email',               data.email);
    formData.append('motDePasse',          data.motDePasse);
    formData.append('confirmerMotDePasse', data.confirmerMotDePasse);
    if (image) formData.append('image', image);

    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register-merchant`, formData).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout() {
    this.http.post(`${this.apiUrl}/auth/logout`, {}, { responseType: 'text' })
      .subscribe({
        next:  () => { localStorage.clear(); this.router.navigate(['/login']); },
        error: () => { localStorage.clear(); this.router.navigate(['/login']); }
      });
  }

  isAdminEmail(email: string): boolean {
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role',  res.role);
    localStorage.setItem('email', res.email);
    // ✅ merchant → stocker nomEntreprise, sinon nom/prenom
    if (res.role === 'MERCHANT') {
      localStorage.setItem('nomEntreprise', res.nomEntreprise || '');
      localStorage.setItem('nom',    '');
      localStorage.setItem('prenom', '');
    } else {
      localStorage.setItem('nom',    res.nom    || '');
      localStorage.setItem('prenom', res.prenom || '');
      localStorage.removeItem('nomEntreprise');
    }
  }

  getToken():          string | null { return localStorage.getItem('token'); }
  getRole():           string | null { return localStorage.getItem('role'); }
  getEmail():          string | null { return localStorage.getItem('email'); }
  getNom():            string | null { return localStorage.getItem('nom'); }
  getPrenom():         string | null { return localStorage.getItem('prenom'); }
  getNomEntreprise():  string | null { return localStorage.getItem('nomEntreprise'); }
  isLoggedIn():        boolean { return !!this.getToken(); }
  isAdmin():           boolean { return this.getRole() === 'ADMIN'; }
  isClient():          boolean { return this.getRole() === 'CLIENT'; }
  isCoursier():        boolean { return this.getRole() === 'COURSIER'; }
  isMerchant():        boolean { return this.getRole() === 'MERCHANT'; } // ✅

  redirectAfterLogin() {
    const role = this.getRole();
    if      (role === 'ADMIN')    this.router.navigate(['/admin/profile']);
    else if (role === 'CLIENT')   this.router.navigate(['/client/profile']);
    else if (role === 'COURSIER') this.router.navigate(['/coursier/profile']);
    else if (role === 'MERCHANT') this.router.navigate(['/merchant/profile']); // ✅
    else this.router.navigate(['/login']);
  }
}
