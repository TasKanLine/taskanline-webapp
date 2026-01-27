import { Component, signal } from '@angular/core';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcher } from '@shared/ui/theme-switcher/theme-switcher';
import {
  LucideAngularModule,
  Pointer,
  Save,
  Trash2,
  Search,
  Check,
  Bookmark,
  User,
  Bell,
  Heart,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-reference',
  imports: [ThemeSwitcher, LucideAngularModule, Button],
  templateUrl: './reference.html',
  styleUrl: './reference.scss',
})
export class Reference {
  readonly Icons = {
    Pointer,
    Save,
    Trash2,
    Search,
    Check,
    Bookmark,
    User,
    Bell,
    Heart,
    X,
  };

  protected isLoading = signal<boolean>(false);
  protected simulateRequest(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 3000);
  }
}
