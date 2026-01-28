import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/auth/store/auth.actions';
import { selectUser } from '@core/auth/store/auth.reducer';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';
import { getUserInitials } from '@shared/utils/initials';
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

  initials = computed(() => getUserInitials(this.user()));

  readonly LogOutIcon = LogOut;

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
