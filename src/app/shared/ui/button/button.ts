import { CommonModule } from '@angular/common';
import { Component, input, computed, ChangeDetectionStrategy, ContentChild } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import { ButtonSeverity, ButtonSize, ButtonVariant, ButtonIconPos } from './button.types';
import { BUTTON_BASE_CLASSES, SOLID_COLORS, OUTLINED_COLORS, TEXT_COLORS, SIZES } from './button.styles';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon
      *ngIf="icon() && iconPos() === 'left'"
      [img]="icon()!"
      [class]="iconClass()"
      [strokeWidth]="2.5"
    ></lucide-icon>

    <ng-content></ng-content>

    <lucide-icon
      *ngIf="icon() && iconPos() === 'right'"
      [img]="icon()!"
      [class]="iconClass()"
      [strokeWidth]="2.5"
    ></lucide-icon>
  `,
  styleUrls: ['./button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClasses()',
  },
})
export class Button {
  severity = input<ButtonSeverity>('primary');
  size = input<ButtonSize>('medium');
  variant = input<ButtonVariant>('basic');
  rounded = input<boolean>(false);
  icon = input<LucideIconData | undefined>(undefined);
  iconPos = input<ButtonIconPos>('left');
  iconOnly = input<boolean>(false);

  computedClasses = computed(() => {
    const currentSeverity = this.severity();
    const currentSize = this.size();
    const currentVariant = this.variant();
    const isIconOnly = this.iconOnly();

    const base = BUTTON_BASE_CLASSES;

    const sizeClass = SIZES[currentSize] || SIZES['medium'];

    const roundClass = this.rounded() ? 'is-rounded' : '';

    const iconOnlyClass = isIconOnly ? 'btn-icon-only' : '';

    let colorClass = '';
    switch (currentVariant) {
      case 'outlined':
        colorClass = OUTLINED_COLORS[currentSeverity];
        break;
      case 'text':
        colorClass = TEXT_COLORS[currentSeverity];
        break;
      case 'link':
        colorClass = TEXT_COLORS[currentSeverity] + ' underline-offset-4 hover:underline';
        break;
      default:
        colorClass = SOLID_COLORS[currentSeverity];
        break;
    }
    if (!colorClass) colorClass = SOLID_COLORS['primary'];

    return `${base} ${colorClass} ${sizeClass} ${roundClass} ${iconOnlyClass}`;
  });

  iconClass = computed(() => {
    switch (this.size()) {
      case 'small':
        return 'size-3.5';
      case 'large':
        return 'size-5';
      default:
        return 'size-4';
    }
  });
}
