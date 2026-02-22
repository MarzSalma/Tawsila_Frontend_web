import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// ✅ 'password' bien présent dans le type
type Step = 'email' | 'code' | 'password' | 'success';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  step = signal<Step>('email');
  loading = signal(false);
  error = signal('');
  userEmail = signal('');
  verifiedCode = signal('');

  // ✅ 3 formulaires séparés
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  codeForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  passwordForm = this.fb.group({
    nouveauMotDePasse: ['', [Validators.required, Validators.minLength(6)]],
    confirmerMotDePasse: ['', Validators.required]
  });

  sendCode() {
    if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
    const email = this.emailForm.value.email!;
    this.loading.set(true);
    this.error.set('');

    this.http.post('http://localhost:8082/api/auth/forgot-password',
      { email }, { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.userEmail.set(email);
        this.step.set('code');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Aucun compte trouvé avec cet email.');
      }
    });
  }

  verifyCode() {
    if (this.codeForm.invalid) { this.codeForm.markAllAsTouched(); return; }
    const code = this.codeForm.value.code!;
    this.loading.set(true);
    this.error.set('');

    this.http.post('http://localhost:8082/api/auth/verify-code',
      { token: code }, { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.verifiedCode.set(code);
        this.step.set('password');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Code invalide ou expiré. Vérifiez votre email.');
      }
    });
  }

  resetPassword() {
    if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; }
    const { nouveauMotDePasse, confirmerMotDePasse } = this.passwordForm.value;

    if (nouveauMotDePasse !== confirmerMotDePasse) {
      this.error.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.http.post('http://localhost:8082/api/auth/reset-password',
      { token: this.verifiedCode(), nouveauMotDePasse },
      { responseType: 'text' }
    ).subscribe({
      next: () => {
        this.loading.set(false);
        this.step.set('success');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Erreur lors de la modification. Réessayez.');
      }
    });
  }

  resendCode() {
    this.step.set('email');
    this.error.set('');
    this.codeForm.reset();
    this.passwordForm.reset();
  }

  goToLogin() { this.router.navigate(['/login']); }
}