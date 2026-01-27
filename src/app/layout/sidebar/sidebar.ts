import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@shared/ui/button/button';
import { CalendarFold, ListChecks, LucideAngularModule, UsersRound } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [Button, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  readonly Icons = {
    ListChecks,
    CalendarFold,
    UsersRound,
  };
}
