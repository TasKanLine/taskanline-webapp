import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/auth/store/auth.actions';
import { selectIsAuthenticated, selectUser } from '@core/auth/store/auth.reducer';
import { getUserInitials } from '@shared/utils/initials';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';
import { LogOut, LucideAngularModule, UserRound } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeSwitcher, Button, RouterLink, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private store = inject(Store);

  @ViewChild('menuButton', { read: ElementRef })
  private menuButton?: ElementRef<HTMLElement>;

  @ViewChild('menuPanel', { read: ElementRef })
  private menuPanel?: ElementRef<HTMLElement>;

  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  user = this.store.selectSignal(selectUser);

  initials = computed(() => getUserInitials(this.user()));
  menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.menuOpen.set(false);
    this.store.dispatch(AuthActions.logout());
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) {
      return;
    }

    const target = event.target as Node | null;
    const buttonEl = this.menuButton?.nativeElement;
    const menuEl = this.menuPanel?.nativeElement;

    if (buttonEl?.contains(target) || menuEl?.contains(target)) {
      return;
    }

    this.closeMenu();
  }
  readonly Icons = {
    UserRound,
    LogOut,
  };
}
