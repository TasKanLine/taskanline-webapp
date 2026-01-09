import { Component } from '@angular/core';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';

@Component({
  selector: 'app-home',
  imports: [ThemeSwitcherComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
