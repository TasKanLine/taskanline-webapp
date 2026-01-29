import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Sidebar } from '@layout/sidebar/sidebar';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';
import { Button } from '@shared/ui/button/button';
import { Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Sidebar, ThemeSwitcher, RouterOutlet, CommonModule, Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private router = inject(Router);

  screenWidth = signal(typeof window !== 'undefined' ? window.innerWidth : 1200);

  isSidebarCollapsed = signal(this.screenWidth() <= 768);

  isMobile = computed(() => this.screenWidth() <= 768);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  showWelcome = computed(() => this.currentUrl() === '/home');

  contentMarginClass = computed(() => {
    const width = this.screenWidth();
    if (width <= 768) {
      return 'ml-0';
    }
    return this.isSidebarCollapsed() ? 'ml-20' : 'ml-52';
  });

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() <= 768) {
      this.isSidebarCollapsed.set(true);
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  readonly Icons = {
    Menu,
    X,
  };
}
