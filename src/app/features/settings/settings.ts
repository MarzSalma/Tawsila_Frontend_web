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

  selectedLang = signal<Lang>(this.tr.currentLang());
  darkMode = signal<boolean>(this.tr.isDark());
  notifications = signal<boolean>(
    localStorage.getItem('notifications') !== 'false'
  );

  languages = [
    { code: 'ar' as Lang, label: 'العربية', flag: '🇹🇳', name: 'Arabe' },
    { code: 'fr' as Lang, label: 'Français', flag: '🇫🇷', name: 'Français' },
    { code: 'en' as Lang, label: 'English',  flag: '🇬🇧', name: 'English'  }
  ];

  constructor() {
    effect(() => {
      this.tr.setDark(this.darkMode());
    });
  }

  setLang(lang: Lang) {
    this.selectedLang.set(lang);
    this.tr.setLang(lang);
  }

  toggleDarkMode() { this.darkMode.update(v => !v); }

  toggleNotifications() {
    this.notifications.update(v => !v);
    localStorage.setItem('notifications', String(this.notifications()));
  }

  goBack() {
    const role = localStorage.getItem('role');
    if (role === 'ADMIN') this.router.navigate(['/admin/profile']);
    else if (role === 'COURSIER') this.router.navigate(['/coursier/profile']);
    else this.router.navigate(['/client/profile']);
  }

  t(key: Parameters<typeof this.tr.t>[0]) { return this.tr.t(key); }
}