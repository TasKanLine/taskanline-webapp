import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '@layout/footer/footer';
import { HeaderComponent } from '@layout/header/header';
import { SidebarComponent } from '@layout/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {}
