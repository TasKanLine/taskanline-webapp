import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/auth/store/auth.actions';
import { selectIsLoading, selectError } from '@core/auth/store/auth.reducer';
import { ValidationError } from '@core/auth/models/auth-dto.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, ThemeSwitcherComponent, Button],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  showPassword = signal(false);

  isLoading = this.store.selectSignal(selectIsLoading);
  error = this.store.selectSignal(selectError);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldError(fieldName: string): string | null {
    const error = this.error() as any;
    if (!error || !error.detail || !Array.isArray(error.detail)) {
      return null;
    }
    // Для логина имена совпадают (email, password), но лучше оставить проверку гибкой
    const fieldError = error.detail.find((e: ValidationError) => e.loc.includes(fieldName));
    return fieldError ? fieldError.msg : null;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, rememberMe } = this.loginForm.value;
      if (email && password) {
        // Handle rememberMe: we can save a flag here or in an effect.
        // For simplicity, let's just save the preference now if valid.
        if (rememberMe) {
          localStorage.setItem('remember_me', 'true');
        } else {
          localStorage.removeItem('remember_me');
        }

        this.store.dispatch(AuthActions.login({ request: { email, password } }));
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
