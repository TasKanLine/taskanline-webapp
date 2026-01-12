import { Component, inject } from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { LucideAngularModule, X, CheckCircle, AlertCircle, Info, TriangleAlert } from 'lucide-angular';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          [@toastAnimation]
          class="pointer-events-auto relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-4 flex items-start gap-3"
          [class.border-l-4]="true"
          [class.border-[var(--success-color)]]="toast.type === 'success'"
          [class.border-[var(--error-color)]]="toast.type === 'error'"
          [class.border-[var(--info-color)]]="toast.type === 'info'"
          [class.border-[var(--warning-color)]]="toast.type === 'warning'"
        >
          <!-- Icon -->
          <div class="mt-0.5 shrink-0">
            @switch (toast.type) {
              @case ('success') {
                <lucide-icon [img]="CheckCircle" class="w-5 h-5 text-[var(--success-color)]"></lucide-icon>
              }
              @case ('error') {
                <lucide-icon [img]="AlertCircle" class="w-5 h-5 text-[var(--error-color)]"></lucide-icon>
              }
              @case ('info') {
                <lucide-icon [img]="Info" class="w-5 h-5 text-[var(--info-color)]"></lucide-icon>
              }
              @case ('warning') {
                <lucide-icon [img]="TriangleAlert" class="w-5 h-5 text-[var(--warning-color)]"></lucide-icon>
              }
            }
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-zinc-100 leading-tight">{{ toast.message }}</p>
          </div>

          <!-- Close Button -->
          <button
            (click)="toastService.remove(toast.id)"
            class="shrink-0 text-zinc-400 hover:text-white transition-colors focus:outline-none"
          >
            <lucide-icon [img]="X" class="w-4 h-4"></lucide-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))]),
    ]),
  ],
})
export class ToastComponent {
  toastService = inject(ToastService);

  readonly X = X;
  readonly CheckCircle = CheckCircle;
  readonly AlertCircle = AlertCircle;
  readonly Info = Info;
  readonly TriangleAlert = TriangleAlert;
}
