import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-all-merchants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-merchants.html',
  styleUrls: ['./all-merchants.scss']
})
export class AllMerchants implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router      = inject(Router);
  role: string | null = null;

  merchants     = signal<any[]>([]);
  loading       = signal(false);
  actionLoading = signal<number | null>(null);
  toastMsg      = signal('');
  toastType     = signal<'success' | 'error'>('success');
  filter        = signal<'ALL' | 'EN_ATTENTE' | 'VALIDE' | 'SUSPENDU'>('ALL');
  sidebarOpen   = signal(false);
  user          = signal<any>(null);

  filteredMerchants = computed(() => {
    const f = this.filter();
    if (f === 'ALL') return this.merchants();
    return this.merchants().filter(m => m.statut === f);
  });

  pendingCount   = computed(() => this.merchants().filter(m => m.statut === 'EN_ATTENTE').length);
  validatedCount = computed(() => this.merchants().filter(m => m.statut === 'VALIDE').length);
  suspendedCount = computed(() => this.merchants().filter(m => m.statut === 'SUSPENDU').length);


  ngOnInit() {
  this.loadMerchants();

  this.userService.getMyProfile().subscribe({
    next: (u) => {
      this.user.set(u);
      this.role = u?.role || null;
    },
    error: () => {
      console.log('Failed to load profile');
    }
  });
}

  loadMerchants() {
    this.loading.set(true);
    this.userService.getAllMerchants().subscribe({
      next: (data) => { this.merchants.set(data); this.loading.set(false); },
      error: ()     => { this.loading.set(false); this.showToast('⚠️ Failed to load merchants', 'error'); }
    });
  }

  // ✅ Valider → donne l'accès au merchant
  valider(id: number) {
    this.actionLoading.set(id);
    this.userService.validerMerchant(id).subscribe({
      next: () => {
        this.merchants.update(list => list.map(m => m.id === id ? { ...m, statut: 'VALIDE' } : m));
        this.actionLoading.set(null);
        this.showToast('✅ Merchant validated — login access granted', 'success');
      },
      error: () => { this.actionLoading.set(null); this.showToast('⚠️ Error validating merchant.', 'error'); }
    });
  }

  // 🚫 Suspendre → bloque l'accès
  suspendre(id: number) {
    this.actionLoading.set(id);
    this.userService.suspendreMerchant(id).subscribe({
      next: () => {
        this.merchants.update(list => list.map(m => m.id === id ? { ...m, statut: 'SUSPENDU' } : m));
        this.actionLoading.set(null);
        this.showToast('🚫 Merchant suspended — access denied', 'success');
      },
      error: () => { this.actionLoading.set(null); this.showToast('⚠️ Error suspending merchant.', 'error'); }
    });
  }

  showToast(msg: string, type: 'success' | 'error') {
    this.toastMsg.set(msg); this.toastType.set(type);
    setTimeout(() => this.toastMsg.set(''), 3500);
  }

  getStatutBadge(statut: string) {
    switch (statut) {
      case 'VALIDE':   return { label: '✅ Validated', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' };
      case 'SUSPENDU': return { label: '🚫 Suspended', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
      default:         return { label: '⏳ Pending',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
    }
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      RESTAURANT: ' Restaurant', SUPERMARCHE: ' Supermarché',
      BOUTIQUE: ' Boutique',     PHARMACIE: ' Pharmacie',
      PATISSERIE: ' Pâtisserie', BOULANGERIE: ' Boulangerie', AUTRE: '🏢 Autre',
    };
    return map[type] || type;
  }

  getInitials(m: any): string {
    return (m.nomEntreprise || '').split(' ').map((w: string) => w[0] || '').join('').toUpperCase().slice(0, 2) || '?';
  }

  getInitialsUser(): string {
    const u = this.user();
    return ((u?.prenom?.[0] || '') + (u?.nom?.[0] || '')).toUpperCase() || '?';
  }
goToProfile() {
  if (this.role === 'ADMIN')         this.router.navigate(['/admin/profile']);
  else if (this.role === 'COURSIER') this.router.navigate(['/coursier/profile']);
  else if (this.role === 'MERCHANT') this.router.navigate(['/merchant/profile']);
  else                               this.router.navigate(['/client/profile']);
  this.closeSidebar();
}
  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  closeSidebar()  { this.sidebarOpen.set(false); }
  goBack()        { this.router.navigate(['/profile']); }
  goToCouriers()  { this.router.navigate(['/admin/all-couriers']); }
  goToSettings()  { this.router.navigate(['/settings']); }
  logout()        { this.authService.logout(); }
}