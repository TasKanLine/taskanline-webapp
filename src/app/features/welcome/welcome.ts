import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainLayout } from '@layout/main-layout/main-layout';

@Component({
  selector: 'app-welcome',
  imports: [MainLayout],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Welcome {}
