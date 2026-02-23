import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Sidebar } from '@layout/sidebar/sidebar';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';
import { Button } from '@shared/ui/button/button';
import { Menu } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Sidebar, ThemeSwitcher, RouterOutlet, Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('sidebarSlide', [
      state('mobileClosed', style({ transform: 'translateX(-208px)' })),
      state('mobileOpen', style({ transform: 'translateX(0)' })),
      state('desktop', style({ transform: 'none' })),
      transition('mobileClosed <=> mobileOpen', animate('300ms ease-in-out')),
      transition('* => desktop', animate('0ms')),
      transition('desktop => *', animate('0ms')),
    ]),
    trigger('contentPush', [
      state('mobileClosed', style({ transform: 'translateX(0)' })),
      state('mobileOpen', style({ transform: 'translateX(208px)' })),
      state('desktop', style({ transform: 'none' })),
      transition('mobileClosed <=> mobileOpen', animate('300ms ease-in-out')),
      transition('* => desktop', animate('0ms')),
      transition('desktop => *', animate('0ms')),
    ]),
  ],
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

  desktopMainMargin = computed(() => {
    if (this.isMobile()) {
      return 0;
    }
    return this.isSidebarCollapsed() ? 80 : 208;
  });

  sidebarAnimationState = computed(() => {
    if (!this.isMobile()) {
      return 'desktop';
    }
    return this.isSidebarCollapsed() ? 'mobileClosed' : 'mobileOpen';
  });

  contentAnimationState = computed(() => {
    if (!this.isMobile()) {
      return 'desktop';
    }
    return this.isSidebarCollapsed() ? 'mobileClosed' : 'mobileOpen';
  });

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() <= 768) {
      this.isSidebarCollapsed.set(true);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== '[') {
      return;
    }
    if (this.isEditableTarget(event.target)) {
      return;
    }
    this.toggleSidebar();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  onMainClick(): void {
    if (this.isMobile() && !this.isSidebarCollapsed()) {
      this.toggleSidebar();
    }
  }

  readonly Icons = {
    Menu,
  };

  private isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }
    const tagName = target.tagName;
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable;
  }
}
