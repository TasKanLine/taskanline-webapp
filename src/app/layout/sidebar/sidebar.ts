import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthActions } from '@core/auth/store/auth.actions';
import { selectIsAuthenticated, selectUser } from '@core/auth/store/auth.reducer';
import { getUserInitials } from '@shared/utils/initials';
import { Button } from '@shared/ui/button/button';
import {
  CalendarFold,
  ChevronsLeft,
  ChevronsRight,
  ListChecks,
  LogOut,
  LucideAngularModule,
  UserRound,
  UsersRound,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  path: string;
  icon: any;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [Button, LucideAngularModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.w-52]': '!collapsed()',
    '[class.w-20]': 'collapsed()',
    '[class.transition-all]': 'true',
    '[class.duration-300]': 'true',
    '[class.ease-in-out]': 'true',
    class:
      'h-screen shrink-0 border-r border-border-color bg-bg-secondary/40 flex flex-col overflow-x-visible overflow-y-auto',
  },
})
export class Sidebar {
  // --- Новая логика (Inputs/Outputs) ---
  collapsed = input.required<boolean>();
  toggleCollapsed = output<void>();

  private hostRef = inject(ElementRef<HTMLElement>);
  private store = inject(Store);
  private router = inject(Router);

  private wasMenuOpen = false;
  private menuPosition = signal<{ top: number; left: number; minWidth: number } | null>(null);

  @ViewChild('menuButton', { read: ElementRef })
  private menuButton?: ElementRef<HTMLElement>;

  @ViewChild('menuPanel', { read: ElementRef })
  private menuPanel?: ElementRef<HTMLElement>;

  readonly navItems: NavItem[] = [
    { label: 'Issues', path: '/home/issues', icon: ListChecks },
    { label: 'Calendar', path: '/home/calendar', icon: CalendarFold },
    { label: 'Team', path: '/home/team', icon: UsersRound },
  ];

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  isActive = (path: string): boolean => {
    const url = this.currentUrl();
    return url === path || url.startsWith(`${path}/`);
  };

  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  user = this.store.selectSignal(selectUser);

  initials = computed(() => getUserInitials(this.user()));
  displayName = computed(() => {
    const currentUser = this.user();
    if (!currentUser) {
      return '';
    }
    return currentUser.username || currentUser.email;
  });

  menuOpen = signal(false);

  constructor() {
    effect(() => {
      this.currentUrl();
      if (untracked(() => this.menuOpen())) {
        this.menuOpen.set(false);
      }
    });

    effect(() => {
      const open = this.menuOpen();
      queueMicrotask(() => {
        if (open) {
          this.updateMenuPosition();
          const panel = this.menuPanel?.nativeElement;
          const first = panel?.querySelector<HTMLElement>(
            '[role="menuitem"], button, a, [tabindex]:not([tabindex="-1"])',
          );
          first?.focus();
        } else if (this.wasMenuOpen) {
          this.menuButton?.nativeElement.focus();
        }
      });
      this.wasMenuOpen = open;
    });

    effect(() => {
      const open = this.menuOpen();
      this.collapsed();
      if (open) {
        queueMicrotask(() => this.updateMenuPosition());
      }
    });
  }

  getMenuPosition(): { top: number; left: number; minWidth: number } | null {
    return this.menuPosition();
  }

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

  // Новый метод для клика по кнопке коллапса
  onCollapseClick(): void {
    this.toggleCollapsed.emit();
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
    if (this.menuButton?.nativeElement?.contains(target) || this.menuPanel?.nativeElement?.contains(target)) {
      return;
    }
    this.closeMenu();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.menuOpen()) {
      this.updateMenuPosition();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.menuOpen()) {
      this.updateMenuPosition();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.menuOpen()) {
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const panel = this.menuPanel?.nativeElement;
    if (!panel) {
      return;
    }
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>('[role="menuitem"], button, a, [tabindex]:not([tabindex="-1"])'),
    ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-disabled'));
    if (focusables.length === 0) {
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (active && !panel.contains(active)) {
      event.preventDefault();
      first.focus();
      return;
    }
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private updateMenuPosition(): void {
    const button = this.menuButton?.nativeElement;
    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const hostRect = this.hostRef.nativeElement.getBoundingClientRect();
    const left = this.collapsed() ? hostRect.right + 8 : rect.left;
    const minWidth = this.collapsed() ? 192 : rect.width;

    this.menuPosition.set({ top: rect.bottom, left, minWidth });
  }

  readonly Icons = {
    ListChecks,
    CalendarFold,
    UsersRound,
    UserRound,
    ChevronsRight,
    ChevronsLeft,
    LogOut,
  };
}
