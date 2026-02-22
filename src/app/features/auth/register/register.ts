import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service'; 

type SelectedRole = 'CLIENT' | 'COURSIER' | null;


@Component({
   selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  selectedRole = signal<SelectedRole>(null);
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);
  successMessage = signal('');

  form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', Validators.required],
    telephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]]
  });

  selectRole(role: 'CLIENT' | 'COURSIER') {
    this.selectedRole.set(role);
    this.error.set('');
    this.successMessage.set('');
  }

  onSubmit() {
    if (!this.selectedRole()) {
      this.error.set('Veuillez choisir un rôle (Client ou Coursier)');
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { nom, prenom, email, motDePasse, address, telephone } = this.form.value;
    this.loading.set(true);
    this.error.set('');

    this.authService.register({
      nom: nom!,
      prenom: prenom!,
      email: email!,
      motDePasse: motDePasse!,
      address: address!,
      telephone: telephone!,
      role: this.selectedRole()!,
      imageUrl: ''
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (this.selectedRole() === 'COURSIER') {
          // Coursier attend validation admin — on déconnecte et affiche message
          localStorage.clear();
          this.successMessage.set('Votre demande a été soumise. Veuillez attendre la validation de l\'administrateur.');
        } else {
          // Client → redirection directe
          this.router.navigate(['/client/profile']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de l\'inscription. Vérifiez vos informations.');
      }
    });
  }

  togglePassword() { this.showPassword.update(v => !v); }
  goToLogin() { this.router.navigate(['/login']); }
}



