import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

type ActiveView = 'profile' | 'editInfo' | 'editPassword';

@Component({
  selector: 'app-merchant-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './merchant-profile.html',
  styleUrls: ['./merchant-profile.scss']
})
export class MerchantProfile implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb          = inject(FormBuilder);
  private router      = inject(Router);

  sidebarOpen  = signal(false);
  activeView   = signal<ActiveView>('profile');
  loading      = signal(false);
  saveSuccess  = signal(false);
  error        = signal('');
  merchant     = signal<any>(null);

  readonly typeActiviteOptions = [
    { value: 'RESTAURANT',  label: '🍽️ Restaurant' },
    { value: 'SUPERMARCHE', label: '🛒 Supermarché' },
    { value: 'BOUTIQUE',    label: '👗 Boutique' },
    { value: 'PHARMACIE',   label: '💊 Pharmacie' },
    { value: 'PATISSERIE',  label: '🎂 Pâtisserie' },
    { value: 'BOULANGERIE', label: '🥖 Boulangerie' },
    { value: 'AUTRE',       label: '📦 Autre' },
  ];

  infoForm = this.fb.group({
    nomEntreprise: ['', Validators.required],
    typeActivite:  ['', Validators.required],
    address:       [''],
    city:          [''],
    codePostal:    [''],
    telephone:     [''],
  });

  passwordForm = this.fb.group({
    ancienMotDePasse: ['', [Validators.required, Validators.minLength(6)]],
    motDePasse:       ['', [Validators.required, Validators.minLength(6)]],
    confirmer:        ['', Validators.required],
  });

  ngOnInit() { this.loadProfile(); }

  loadProfile() {
    this.loading.set(true);
    this.userService.getMerchantProfile().subscribe({
      next: (data) => {
        this.merchant.set(data);
        this.infoForm.patchValue({
          nomEntreprise: data.nomEntreprise,
          typeActivite:  data.typeActivite,
          address:       data.address    || '',
          city:          data.city       || '',
          codePostal:    data.codePostal || '',
          telephone:     data.telephone  || '',
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  saveInfo() {
    if (this.infoForm.invalid) { this.infoForm.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');

    this.userService.updateMerchantProfile(this.infoForm.value).subscribe({
      next: (updated) => {
        this.merchant.set(updated);
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
    if (motDePasse !== confirmer) { this.error.set('Les mots de passe ne correspondent pas'); return; }

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

  getStatutBadge() {
    const s = this.merchant()?.statut;
    if (s === 'VALIDE')     return { label: 'Validé',     color: '#059669', bg: '#ECFDF5' };
    if (s === 'SUSPENDU')   return { label: 'Suspendu',   color: '#DC2626', bg: '#FEF2F2' };
    return                         { label: 'En attente', color: '#D97706', bg: '#FFFBEB' };
  }

  getTypeLabel() {
    const opt = this.typeActiviteOptions.find(o => o.value === this.merchant()?.typeActivite);
    return opt?.label || this.merchant()?.typeActivite || '—';
  }

  getInitials() {
    const name = this.merchant()?.nomEntreprise || '';
    return name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);
  }

  toggleSidebar()   { this.sidebarOpen.update(v => !v); }
  closeSidebar()    { this.sidebarOpen.set(false); }
  setView(v: ActiveView) { this.activeView.set(v); this.error.set(''); this.closeSidebar(); }
  logout()          { this.authService.logout(); }
  goToSettings()    { this.router.navigate(['/settings']); this.closeSidebar(); }
}