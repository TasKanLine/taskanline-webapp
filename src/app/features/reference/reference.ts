import { Component } from '@angular/core';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reference',
  imports: [ThemeSwitcherComponent, LucideAngularModule, Button],
  templateUrl: './reference.html',
  styleUrl: './reference.scss',
})
export class Reference {}
