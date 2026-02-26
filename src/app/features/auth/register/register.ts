import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

type SelectedRole = 'CLIENT' | 'COURSIER' | null;

// Validator : confirmPassword === motDePasse
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pwd  = control.get('motDePasse')?.value;
  const conf = control.get('confirmPassword')?.value;
  return pwd && conf && pwd !== conf ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);

  selectedRole    = signal<SelectedRole>(null);
  loading         = signal(false);
  error           = signal('');
  showPassword    = signal(false);
  successMessage  = signal('');
  selectedImage   = signal<File | null>(null);
  previewUrl      = signal<string | null>(null);

  form = this.fb.group({
    nom:             ['', [Validators.required, Validators.minLength(2)]],
    prenom:          ['', [Validators.required, Validators.minLength(2)]],
    email:           ['', [Validators.required, Validators.email]],
    motDePasse:      ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],   // ✅ confirm password
    telephone:       ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]]
    // ✅ address supprimé
  }, { validators: passwordMatchValidator });

  selectRole(role: 'CLIENT' | 'COURSIER') {
    this.selectedRole.set(role);
    this.error.set('');
    this.successMessage.set('');
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedImage.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (!this.selectedRole()) {
      this.error.set('Veuillez choisir un rôle (Client ou Coursier)');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.hasError('passwordMismatch')) {
        this.error.set('Les mots de passe ne correspondent pas');
      }
      return;
    }

    const { nom, prenom, email, motDePasse, telephone } = this.form.value;
    this.loading.set(true);
    this.error.set('');

    this.authService.register({
      nom:        nom!,
      prenom:     prenom!,
      email:      email!,
      motDePasse: motDePasse!,
      address:    '',
      city:       '',
      codePostal: '',
      telephone:  telephone!,
      role:       this.selectedRole()!,
      imageUrl:   ''
    }, this.selectedImage() || undefined).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.selectedRole() === 'COURSIER') {
          localStorage.clear();
          this.successMessage.set('Votre demande a été soumise. Veuillez attendre la validation.');
        } else {
          this.router.navigate(['/client/profile']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de l\'inscription.');
      }
    });
  }

  goToLogin()            { this.router.navigate(['/login']); }
  goToRegisterMerchant() { this.router.navigate(['/register-merchant']); } // ✅
  togglePassword()       { this.showPassword.update(v => !v); }
}
