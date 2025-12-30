import { Component, signal, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { Button } from '@shared/ui/button/button';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/auth/store/auth.actions';
import { selectIsLoading, selectError } from '@core/auth/store/auth.reducer';
import { ValidationError } from '@core/auth/models/auth-dto.model';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, Button, ThemeSwitcherComponent],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  showPassword = signal(false);
  isLoading = this.store.selectSignal(selectIsLoading);
  error = this.store.selectSignal(selectError);

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  passwordStrength = signal(0);
  passwordStrengthLabel = computed(() => {
    const strength = this.passwordStrength();
    if (strength === 0) {
      return '';
    }
    if (strength < 3) {
      return 'Weak';
    }
    if (strength < 4) {
      return 'Medium';
    }
    return 'Strong';
  });

  constructor() {
    this.signupForm.get('password')?.valueChanges.subscribe((val) => {
      this.calculatePasswordStrength(val || '');
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  // ВАЖНОЕ ИСПРАВЛЕНИЕ: Маппинг имен полей Angular -> API
  getFieldError(controlName: string): string | null {
    const error = this.error() as any;
    if (!error || !error.detail || !Array.isArray(error.detail)) {
      return null;
    }

    // Словарь соответствия: Имя в форме -> Имя в API (snake_case)
    const fieldMapping: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      email: 'email',
      username: 'username',
      password: 'password',
    };

    const apiFieldName = fieldMapping[controlName] || controlName;

    // Ищем ошибку, где loc содержит имя поля API
    const fieldError = error.detail.find((e: ValidationError) => e.loc.includes(apiFieldName));

    return fieldError ? fieldError.msg : null;
  }

  calculatePasswordStrength(password: string): void {
    let score = 0;
    if (!password) {
      this.passwordStrength.set(0);
      return;
    }
    if (password.length > 8) {
      score += 1;
    }
    if (/[A-Z]/.test(password)) {
      score += 1;
    }
    if (/[0-9]/.test(password)) {
      score += 1;
    }
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }

    this.passwordStrength.set(score);
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const { email, username, firstName, lastName, password } = this.signupForm.value;
      // Проверка на null/undefined
      if (email && username && firstName && lastName && password) {
        this.store.dispatch(
          AuthActions.signup({
            request: {
              email,
              username,
              first_name: firstName,
              last_name: lastName,
              password,
            },
          }),
        );
      }
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
