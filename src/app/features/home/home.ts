import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MainLayoutComponent } from '@layout/main-layout/main-layout';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainLayoutComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
