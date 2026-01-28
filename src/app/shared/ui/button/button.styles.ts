export const BUTTON_BASE_CLASSES = 'ui-btn inline-flex items-center gap-3';

export const SOLID_COLORS: Record<string, string> = {
  primary: 'text-[var(--text-btn-primary)] bg-[var(--color-primary)] border-transparent focus-visible:ring-blue-500',
  secondary: 'text-white bg-zinc-800 border-transparent focus-visible:ring-gray-200',
  success: 'text-[var(--text-btn-primary)] bg-[var(--success-color)] border-transparent focus-visible:ring-emerald-500',
  info: 'text-[var(--text-btn-primary)] bg-[var(--info-color)] border-transparent ui-btn hover-gradient-glide',
  warning: 'text-[var(--text-btn-primary)] bg-[var(--warning-color)] border-transparent focus-visible:ring-amber-500',
  help: 'text-[var(--text-btn-primary)] bg-[var(--help-color)] border-transparent',
  danger:
    'text-[var(--text-btn-primary)] bg-[var(--error-color)] border-transparent focus-visible:ring-rose-500 ui-btn hover-gradient-wave',
  contrast: 'text-black bg-white border-transparent',
};

export const OUTLINED_COLORS: Record<string, string> = {
  primary:
    'bg-transparent border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
  secondary: 'bg-transparent border-zinc-500 text-zinc-500 hover:bg-zinc-500/10',
  success:
    'bg-transparent border-[var(--success-color)] text-[var(--success-color)] hover:bg-[var(--success-color)]/10',
  info: 'bg-transparent border-[var(--info-color)] text-[var(--info-color)] hover:bg-[var(--info-color)]/10',
  warning:
    'bg-transparent border-[var(--warning-color)] text-[var(--warning-color)] hover:bg-[var(--warning-color)]/10',
  help: 'bg-transparent border-[var(--help-color)] text-[var(--help-color)] hover:bg-[var(--help-color)]/10',
  danger: 'bg-transparent border-[var(--error-color)] text-[var(--error-color)] hover:bg-[var(--error-color)]/10',
  contrast: 'bg-transparent border-white text-white hover:bg-white/10',
};

export const TEXT_COLORS: Record<string, string> = {
  primary: 'bg-transparent border-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
  secondary: 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-500/10',
  success: 'bg-transparent border-transparent text-[var(--success-color)] hover:bg-[var(--success-color)]/10',
  info: 'bg-transparent border-transparent text-[var(--info-color)] hover:bg-[var(--info-color)]/10',
  warning: 'bg-transparent border-transparent text-[var(--warning-color)] hover:bg-[var(--warning-color)]/10',
  help: 'bg-transparent border-transparent text-[var(--help-color)] hover:bg-[var(--help-color)]/10',
  danger: 'bg-transparent border-transparent text-[var(--error-color)] hover:bg-[var(--error-color)]/10',
  contrast: 'bg-transparent border-transparent text-white hover:bg-white/10',
};

export const SIZES: Record<string, string> = {
  small: 'size-small',
  medium: 'size-medium',
  large: 'size-large',
};
