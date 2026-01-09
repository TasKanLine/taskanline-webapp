import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';
import { House, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  imports: [ThemeSwitcherComponent, Button, LucideAngularModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  private router = inject(Router);

  readonly HomeIcon = House;

  goHome(): void {
    this.router.navigate(['/']);
  }
}
