import { Component } from '@angular/core';
import { Button } from '@shared/ui/button/button';
import { ThemeSwitcherComponent } from '@shared/ui/theme-switcher/theme-switcher';
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
  imports: [ThemeSwitcherComponent, LucideAngularModule, Button],
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
}
