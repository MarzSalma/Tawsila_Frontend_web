import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslationService, Lang } from '../../core/services/translation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class Settings {

  private router = inject(Router);
  tr = inject(TranslationService);

  // ── State ─────────────────────────────────────────────────────
  sidebarOpen = signal(false);

  user = signal<any>({
    prenom: localStorage.getItem('prenom') || '',
    nom:    localStorage.getItem('nom')    || '',
    email:  localStorage.getItem('email')  || ''
  });

  // Rôle pour afficher/masquer Couriers + Merchants dans la sidebar
  role = localStorage.getItem('role') || '';

  selectedLang  = signal<Lang>(this.tr.currentLang());
  darkMode      = signal<boolean>(this.tr.isDark());
  notifications = signal<boolean>(localStorage.getItem('notifications') !== 'false');

  languages = [
    { code: 'ar' as Lang, label: 'العربية', flag: '🇹🇳', name: 'Arabe'   },
    { code: 'fr' as Lang, label: 'Français', flag: '🇫🇷', name: 'Français' },
    { code: 'en' as Lang, label: 'English',  flag: '🇬🇧', name: 'English'  }
  ];

  constructor() {
    effect(() => { this.tr.setDark(this.darkMode()); });
  }

  // ── Sidebar ───────────────────────────────────────────────────
  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar()  { this.sidebarOpen.set(false); }

  // ── Initials ──────────────────────────────────────────────────
  getInitialsUser(): string {
    const u = this.user();
    return ((u?.prenom?.[0] || '') + (u?.nom?.[0] || '')).toUpperCase() || '?';
  }

  // ── Settings actions ──────────────────────────────────────────
  setLang(lang: Lang) {
    this.selectedLang.set(lang);
    this.tr.setLang(lang);
  }

  toggleDarkMode() { this.darkMode.update(v => !v); }

  toggleNotifications() {
    this.notifications.update(v => !v);
    localStorage.setItem('notifications', String(this.notifications()));
  }

  // ── Navigation ────────────────────────────────────────────────
goToProfile() {
  if (this.role === 'ADMIN')         this.router.navigate(['/admin/profile']);
  else if (this.role === 'COURSIER') this.router.navigate(['/coursier/profile']);
  else if (this.role === 'MERCHANT') this.router.navigate(['/merchant/profile']);
  else                               this.router.navigate(['/client/profile']);
  this.closeSidebar();
}

  goToCouriers() {
    this.router.navigate(['/admin/all-couriers']);
    this.closeSidebar();
  }

  goToMerchants() {
    this.router.navigate(['/admin/all-merchants']);
    this.closeSidebar();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

   goToSettings() {
    this.router.navigate(['/settings']);
  }
  

  t(key: Parameters<typeof this.tr.t>[0]) { return this.tr.t(key); }
}