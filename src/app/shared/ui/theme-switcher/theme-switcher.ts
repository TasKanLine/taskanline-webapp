import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@core/services/theme-service';
import { LucideAngularModule, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button
      (click)="themeService.toggleTheme()"
      class="
        flex items-center justify-center p-2 rounded-full transition-all duration-300
        bg-[--bg-secondary] hover:opacity-80
        border border-[--border-color]
        "
      [attr.aria-label]="'Переключить тему'"
    >
      <lucide-icon
        *ngIf="themeService.currentTheme() === 'light'"
        [name]="SunIcon"
        [size]="20"
        strokeWidth="2"
        class="text-[#1b1b1f]"
      ></lucide-icon>

      <lucide-icon
        *ngIf="themeService.currentTheme() === 'dark'"
        [name]="MoonIcon"
        [size]="20"
        strokeWidth="2"
        class="text-[#faf3e1]"
      ></lucide-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcherComponent {
  public themeService = inject(ThemeService);

  public SunIcon = Sun;
  public MoonIcon = Moon;
}
