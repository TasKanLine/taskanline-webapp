import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sidebar } from '@layout/sidebar/sidebar';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Sidebar, ThemeSwitcher],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
