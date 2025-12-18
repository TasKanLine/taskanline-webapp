import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, ThemeSwitcherComponent, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  showPassword = signal(false);
  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        console.log('Login form submitted', this.loginForm.value);
      }, 2000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
