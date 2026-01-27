import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {}
