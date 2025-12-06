import { CommonModule } from '@angular/common';
import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { ButtonSeverity, ButtonSize } from './button.types';
import { BUTTON_BASE_CLASSES, SOLID_COLORS, SIZES } from './button.styles';

@Component({
  selector: 'button[appButton], a[appButton]',
  imports: [CommonModule],
  template: '<ng-content></ng-content>',
  styleUrls: ['./button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClasses()',
  },
})
export class Button {
  severity = input<ButtonSeverity>('primary');
  size = input<ButtonSize>('medium');
  rounded = input<boolean>(false);

  computedClasses = computed(() => {
    const currentSeverity = this.severity();
    const currentSize = this.size();

    const base = BUTTON_BASE_CLASSES;

    const colors = SOLID_COLORS[currentSeverity] || SOLID_COLORS['primary'];

    const sizeClass = SIZES[currentSize] || SIZES['medium'];

    const roundClass = this.rounded() ? 'is-rounded' : '';

    return `${base} ${colors} ${sizeClass} ${roundClass}`;
  });
}
