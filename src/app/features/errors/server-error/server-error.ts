import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';
import { House, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-server-error',
  imports: [ThemeSwitcher, Button, LucideAngularModule],
  templateUrl: './server-error.html',
  styleUrl: './server-error.scss',
})
export class ServerError {
  private router = inject(Router);

  readonly HomeIcon = House;

  goHome(): void {
    this.router.navigate(['/']);
  }
}
