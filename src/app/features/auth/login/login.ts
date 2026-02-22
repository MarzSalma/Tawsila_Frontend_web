import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ADMIN_EMAILS } from '../../../core/services/auth.service'; 


@Component({
  selector: 'app-login',
   standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, motDePasse } = this.form.value;
    this.loading.set(true);
    this.error.set('');

    this.authService.login({ email: email!, motDePasse: motDePasse! }).subscribe({
      next: (res) => {
        this.loading.set(false);
        // Vérification : si email admin mais rôle pas ADMIN → refuser
        const isAdminEmail = this.authService.isAdminEmail(email!);
        if (isAdminEmail && res.role !== 'ADMIN') {
          this.error.set('Accès refusé. Compte non administrateur.');
          localStorage.clear();
          return;
        }
        this.authService.redirectAfterLogin();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Email ou mot de passe incorrect.');
      }
    });
  }

  get isAdminEmail(): boolean {
    const email = this.form.get('email')?.value || '';
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
  }

  togglePassword() { this.showPassword.update(v => !v); }

  goToRegister() { this.router.navigate(['/register']); }

}
