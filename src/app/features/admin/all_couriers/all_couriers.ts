import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-all-couriers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all_couriers.html',
  styleUrls: ['./all_couriers.scss']
})
export class AllCouriers implements OnInit {

  
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router      = inject(Router);

  sidebarOpen = signal(false);
  user        = signal<any>(null);
  role: string | null = null;
  activeView  = signal<'profile' | 'couriers'>('couriers');

  // ─────────────────────────────────────────────
  // Couriers state
  // ─────────────────────────────────────────────
  coursiers     = signal<any[]>([]);
  loading       = signal(false);
  actionLoading = signal<number | null>(null);
  toastMsg      = signal('');
  toastType     = signal<'success' | 'error'>('success');
  filter        = signal<'ALL' | 'EN_ATTENTE' | 'VALIDE' | 'REFUSE'>('ALL');

  // ─────────────────────────────────────────────
  // Computed values
  // ─────────────────────────────────────────────
  filteredCoursiers = computed(() => {
    const f = this.filter();
    if (f === 'ALL') return this.coursiers();
    return this.coursiers().filter(c => c.statut === f);
  });

  pendingCount = computed(() =>
    this.coursiers().filter(c => c.statut === 'EN_ATTENTE').length
  );

  validatedCount = computed(() =>
    this.coursiers().filter(c => c.statut === 'VALIDE').length
  );

  refusedCount = computed(() =>
    this.coursiers().filter(c => c.statut === 'REFUSE').length
  );

  // ─────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────
 ngOnInit() {
  this.loadCoursiers();

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

  // ─────────────────────────────────────────────
  // Load data
  // ─────────────────────────────────────────────
  loadCoursiers() {
    this.loading.set(true);

    this.userService.getAllCoursiers().subscribe({
      next: (data) => {
        this.coursiers.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.showToast('⚠️ Failed to load couriers', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // Admin actions
  // ─────────────────────────────────────────────

  // ✅ Accept courier
  valider(id: number) {
    this.actionLoading.set(id);

    this.userService.validerCoursier(id).subscribe({
      next: () => {
        this.coursiers.update(list =>
          list.map(c =>
            c.id === id ? { ...c, statut: 'VALIDE' } : c
          )
        );

        this.actionLoading.set(null);
        this.showToast('✅ Courier accepted — login access granted', 'success');
      },
      error: () => {
        this.actionLoading.set(null);
        this.showToast('⚠️ Error validating courier. Try again.', 'error');
      }
    });
  }

  // ❌ Refuse courier
  refuser(id: number) {
    this.actionLoading.set(id);

    this.userService.refuserCoursier(id).subscribe({
      next: () => {
        this.coursiers.update(list =>
          list.map(c =>
            c.id === id ? { ...c, statut: 'REFUSE' } : c
          )
        );

        this.actionLoading.set(null);
        this.showToast('❌ Courier refused — access denied', 'success');
      },
      error: () => {
        this.actionLoading.set(null);
        this.showToast('⚠️ Error refusing courier. Try again.', 'error');
      }
    });
  }

  // ─────────────────────────────────────────────
  // Sidebar controls
  // ─────────────────────────────────────────────
  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  setView(view: 'profile' | 'couriers') {
    this.activeView.set(view);
  }

  goToCouriers() {
    this.router.navigate(['/couriers']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
goToProfile() {
  if (this.role === 'ADMIN')         this.router.navigate(['/admin/profile']);
  else if (this.role === 'COURSIER') this.router.navigate(['/coursier/profile']);
  else if (this.role === 'MERCHANT') this.router.navigate(['/merchant/profile']);
  else                               this.router.navigate(['/client/profile']);
  this.closeSidebar();
}
  goToMerchants() {
  this.router.navigate(['/admin/all-merchants']);
  this.closeSidebar();
}


  logout() {
    this.authService.logout();
  }

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  showToast(msg: string, type: 'success' | 'error') {
    this.toastMsg.set(msg);
    this.toastType.set(type);
    setTimeout(() => this.toastMsg.set(''), 3500);
  }

  getStatutBadge(statut: string) {
    switch (statut) {
      case 'VALIDE':
        return {
          label: 'Validated',
          color: '#059669',
          bg: '#ECFDF5',
          border: '#A7F3D0'
        };

      case 'REFUSE':
        return {
          label: 'Refused',
          color: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA'
        };

      default:
        return {
          label: 'Pending',
          color: '#D97706',
          bg: '#FFFBEB',
          border: '#FDE68A'
        };
    }
  }

  // Initials for courier card
  getInitials(c: any): string {
    return (
      (c?.prenom?.[0] || '') +
      (c?.nom?.[0] || '')
    ).toUpperCase() || '?';
  }

  // Initials for sidebar user
  getInitialsUser(): string {
    const u = this.user();
    return (
      (u?.prenom?.[0] || '') +
      (u?.nom?.[0] || '')
    ).toUpperCase() || '?';
  }

  // Simple translation fallback
  t(key: string): string {
    return key;
  }
}