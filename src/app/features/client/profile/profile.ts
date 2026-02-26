import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { TranslationService } from '../../../core/services/translation.service';

type ActiveView = 'profile' | 'editInfo' | 'editPassword';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  tr = inject(TranslationService);

  sidebarOpen = signal(false);
  activeView = signal<ActiveView>('profile');
  loading = signal(false);
  saveSuccess = signal(false);
  error = signal('');
  user = signal<any>(null);

  role = this.authService.getRole();

  infoForm = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    address: ['', Validators.required],
    telephone: ['', Validators.required],
    vehiculeType: [''],
    immatriculation: [''],
    zoneLivraison: [''],
    disponibilite: ['']
  });

  passwordForm = this.fb.group({
    ancienMotDePasse: ['', [Validators.required, Validators.minLength(6)]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    confirmer: ['', Validators.required]
  });

  ngOnInit() {
    // Apply saved settings on load
    this.tr.applyStoredSettings();
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    const req = this.role === 'COURSIER'
      ? this.userService.getCoursierProfile()
      : this.userService.getMyProfile();

    req.subscribe({
      next: (data) => {
        this.user.set(data);
        this.patchInfoForm(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  patchInfoForm(data: any) {
    this.infoForm.patchValue({
      nom: data.nom,
      prenom: data.prenom,
      address: data.address,
      telephone: data.telephone,
      vehiculeType: data.vehiculeType || '',
      immatriculation: data.immatriculation || '',
      zoneLivraison: data.zoneLivraison || '',
      disponibilite: data.disponibilite || ''
    });
  }

  saveInfo() {
    if (this.infoForm.invalid) { this.infoForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    const data = this.infoForm.value;
    const req = this.role === 'COURSIER'
      ? this.userService.updateCoursierProfile(data)
      : this.userService.updateProfile(data);

    req.subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.loading.set(false);
        this.saveSuccess.set(true);
        this.activeView.set('profile');
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Erreur lors de la mise à jour.');
      }
    });
  }

  savePassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    const { ancienMotDePasse, motDePasse, confirmer } = this.passwordForm.value;

    if (motDePasse !== confirmer) {
      this.error.set(this.tr.t('min6'));
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.userService.changePassword(ancienMotDePasse!, motDePasse!).subscribe({
      next: () => {
        this.loading.set(false);
        this.saveSuccess.set(true);
        this.passwordForm.reset();
        this.activeView.set('profile');
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Ancien mot de passe incorrect.');
      }
    });
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar() { this.sidebarOpen.set(false); }

  setView(view: ActiveView) {
    this.activeView.set(view);
    this.error.set('');
    this.closeSidebar();
  }

  logout() { this.authService.logout(); }

  goToSettings() {
    this.router.navigate(['/settings']);
    this.closeSidebar();
  }

  getRoleBadge() {
    const r = this.role;
    if (r === 'ADMIN') return { label: this.tr.t('administrateur'), icon: '🛡️', color: '#7C3AED' };
    if (r === 'COURSIER') return { label: this.tr.t('coursier'), icon: '🚴', color: '#0891B2' };
    return { label: this.tr.t('client'), icon: '👤', color: '#059669' };
  }

  getInitials() {
    const u = this.user();
    if (!u) return '?';
    return `${(u.prenom || '')[0] || ''}${(u.nom || '')[0] || ''}`.toUpperCase();
  }

  t(key: Parameters<typeof this.tr.t>[0]) { return this.tr.t(key); }
}