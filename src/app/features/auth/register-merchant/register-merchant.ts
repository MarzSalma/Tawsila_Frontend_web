import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pwd  = control.get('motDePasse')?.value;
  const conf = control.get('confirmerMotDePasse')?.value;
  return pwd && conf && pwd !== conf ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register-merchant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-merchant.html',
  styleUrls: ['./register-merchant.scss']
})
export class RegisterMerchant {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);

  loading        = signal(false);
  error          = signal('');
  successMessage = signal('');
  showPassword   = signal(false);
  selectedImage  = signal<File | null>(null);
  previewUrl     = signal<string | null>(null);

  readonly typeActiviteOptions = [
    { value: 'RESTAURANT',  label: ' Restaurant' },
    { value: 'SUPERMARCHE', label: ' Supermarché' },
    { value: 'BOUTIQUE',    label: ' Boutique' },
    { value: 'PHARMACIE',   label: ' Pharmacie' },
    { value: 'PATISSERIE',  label: ' Pâtisserie' },
    { value: 'BOULANGERIE', label: ' Boulangerie' },
    { value: 'AUTRE',       label: ' Autre' },
  ];

  form = this.fb.group({
    nomEntreprise:       ['', [Validators.required, Validators.minLength(2)]],
    typeActivite:        ['', Validators.required],
    email:               ['', [Validators.required, Validators.email]],
    telephone:           ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
    address:             [''],
    city:                [''],
    codePostal:          [''],
    motDePasse:          ['', [Validators.required, Validators.minLength(6)]],
    confirmerMotDePasse: ['', Validators.required],
  }, { validators: passwordMatchValidator });

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedImage.set(file);
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      if (this.form.hasError('passwordMismatch'))
        this.error.set('Les mots de passe ne correspondent pas');
      return;
    }

    const v = this.form.value;
    this.loading.set(true);
    this.error.set('');

    this.authService.registerMerchant({
      nomEntreprise:       v.nomEntreprise!,
      typeActivite:        v.typeActivite!,
      email:               v.email!,
      telephone:           v.telephone!,
      address:             v.address    || '',
      city:                v.city       || '',
      codePostal:          v.codePostal || '',
      motDePasse:          v.motDePasse!,
      confirmerMotDePasse: v.confirmerMotDePasse!,
    }, this.selectedImage() || undefined).subscribe({
      next: () => {
        this.loading.set(false);
        localStorage.clear();
        this.successMessage.set('Votre compte merchant a été soumis. Veuillez attendre la validation de l\'administrateur.');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Erreur lors de l\'inscription.');
      }
    });
  }

  togglePassword() { this.showPassword.update(v => !v); }
  goToLogin()      { this.router.navigate(['/login']); }
  goToRegister()   { this.router.navigate(['/register']); }
}