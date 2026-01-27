import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Footer } from '@layout/footer/footer';
import { Header } from '@layout/header/header';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
