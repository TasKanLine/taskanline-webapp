import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeSwitcherComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
