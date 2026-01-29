import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './issues.html',
  styleUrl: './issues.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Issues {}
