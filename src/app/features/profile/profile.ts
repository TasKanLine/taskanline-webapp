import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/auth/store/auth.actions';
import { selectUser } from '@core/auth/store/auth.reducer';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';
import { LucideAngularModule, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, Button, ThemeSwitcher, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  private store = inject(Store);

  user = this.store.selectSignal(selectUser);

  initials = computed(() => {
    const u = this.user();
    if (!u) {
      return '';
    }

    const first = u.first_name ? u.first_name[0].toUpperCase() : '';
    const last = u.last_name ? u.last_name[0].toUpperCase() : '';

    if (first && last) {
      return `${first}${last}`;
    }
    if (first) {
      return first;
    }
    if (u.username) {
      return u.username.substring(0, 2).toUpperCase();
    }
    return u.email.substring(0, 2).toUpperCase();
  });

  readonly LogOutIcon = LogOut;

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
