import { CommonModule } from '@angular/common';
import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, LucideIconData, LoaderCircle } from 'lucide-angular';
import { ButtonSeverity, ButtonSize, ButtonVariant, ButtonIconPos, ButtonJustify } from './button.types';
import { BUTTON_BASE_CLASSES, SOLID_COLORS, OUTLINED_COLORS, TEXT_COLORS, SIZES } from './button.styles';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (loading()) {
      <lucide-icon
        [img]="LoaderCircleIcon"
        class="animate-spin shrink-0"
        [class]="iconClass()"
        [strokeWidth]="2.5"
      ></lucide-icon>
    }

    @if (!loading() && icon() && iconPos() === 'left') {
      <lucide-icon [img]="icon()!" [class]="iconClass()" class="shrink-0" [strokeWidth]="2.5"></lucide-icon>
    }

    @if (!loading() && !iconOnly()) {
      <span class="truncate">
        <ng-content></ng-content>
      </span>
    }

    @if (!loading() && icon() && iconPos() === 'right') {
      <lucide-icon [img]="icon()!" [class]="iconClass()" class="shrink-0 ml-auto" [strokeWidth]="2.5"></lucide-icon>
    }
  `,
  styleUrls: ['./button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClasses()',
    '[attr.disabled]': 'isDisabled() ? true : null',
    '[attr.aria-disabled]': 'isDisabled()',
  },
})
export class Button {
  //INFO Inputs
  severity = input<ButtonSeverity>('primary');
  size = input<ButtonSize>('medium');
  justify = input<ButtonJustify>('center');
  variant = input<ButtonVariant>('basic');
  rounded = input<boolean>(false);
  icon = input<LucideIconData | undefined>(undefined);
  iconPos = input<ButtonIconPos>('left');
  iconOnly = input<boolean>(false);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  shadow = input<boolean>(false);

  readonly LoaderCircleIcon = LoaderCircle;

  isDisabled = computed(() => this.disabled() || this.loading());

  computedClasses = computed(() => {
    const currentSeverity = this.severity();
    const currentSize = this.size();
    const currentVariant = this.variant();
    const currentJustify = this.justify();
    const isIconOnly = this.iconOnly();
    const isLoading = this.loading();
    const isShadow = this.shadow() || currentVariant === 'raised' || currentVariant === 'raised-text';

    const base = BUTTON_BASE_CLASSES;
    const sizeClass = SIZES[currentSize] || SIZES['medium'];
    const roundClass = this.rounded() ? 'is-rounded' : '';
    const iconOnlyClass = isIconOnly ? 'btn-icon-only' : '';
    const gapClass = isIconOnly ? '' : 'gap-3';

    const justifyClasses: Record<ButtonJustify, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    const justifyClass = justifyClasses[currentJustify] || 'justify-center';

    const stateClass = this.isDisabled()
      ? 'opacity-75 cursor-not-allowed pointer-events-none'
      : isLoading
        ? 'cursor-wait'
        : '';

    const shadowClass = isShadow ? 'shadow-md hover:shadow-lg active:shadow-none transition-shadow' : '';

    let colorClass = '';
    switch (currentVariant) {
      case 'outlined':
        colorClass = OUTLINED_COLORS[currentSeverity];
        break;
      case 'text':
      case 'raised-text':
        colorClass = TEXT_COLORS[currentSeverity];
        break;
      case 'link':
        colorClass = TEXT_COLORS[currentSeverity] + ' underline-offset-4 hover:underline';
        break;
      case 'raised':
      default:
        colorClass = SOLID_COLORS[currentSeverity];
        break;
    }

    if (!colorClass) {
      colorClass = SOLID_COLORS['primary'];
    }

    return `${base} ${colorClass} ${sizeClass} ${roundClass} ${iconOnlyClass} ${gapClass} ${stateClass} ${shadowClass} ${justifyClass}`;
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
