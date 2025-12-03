import { Component } from '@angular/core';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reference',
  imports: [ThemeSwitcherComponent, LucideAngularModule],
  templateUrl: './reference.html',
  styleUrl: './reference.scss',
})
export class Reference {}
