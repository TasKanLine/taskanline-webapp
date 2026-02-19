import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  currentTheme = signal<Theme>('light');

  constructor() {
    this.initTheme();

    effect(() => {
      const theme = this.currentTheme();
      this.applyTheme(theme);
    });
  }

  private initTheme(): void {
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    this.currentTheme.set(initialTheme);
  }

  toggleTheme(): void {
    const next = this.currentTheme() === 'light' ? 'dark' : 'light';

    const anyDoc = document as any;
    if (typeof anyDoc.startViewTransition === 'function') {
      anyDoc.startViewTransition(() => {
        this.currentTheme.set(next);
      });
    } else {
      this.currentTheme.set(next);
    }
  }

  private applyTheme(theme: Theme): void {
    localStorage.setItem('theme', theme);

    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}
