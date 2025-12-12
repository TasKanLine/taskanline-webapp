export const BUTTON_BASE_CLASSES = 'ui-btn';

export const SOLID_COLORS: Record<string, string> = {
  primary: 'text-black bg-white border-transparent focus-visible:ring-blue-500',
  secondary: 'text-white bg-zinc-800 border-transparent shadow-sm focus-visible:ring-gray-200',
  success: 'text-black bg-emerald-500 border-transparent focus-visible:ring-emerald-500',
  info: 'text-black bg-sky-400 border-transparent ui-btn hover-gradient-glide',
  warning: 'text-black bg-amber-500 border-transparent focus-visible:ring-amber-500',
  help: 'text-black bg-violet-400 border-transparent',
  danger: 'text-black bg-rose-500 border-transparent focus-visible:ring-rose-500 ui-btn hover-gradient-wave',
  contrast: 'text-black bg-white border-transparent shadow-lg',
};
export const OUTLINED_COLORS: Record<string, string> = {
  primary: 'bg-transparent border-white text-white hover:bg-black/10',
  secondary: 'bg-transparent border-zinc-500 text-zinc-500 hover:bg-zinc-500/10',
  success: 'bg-transparent border-emerald-600 text-emerald-600 hover:bg-emerald-600/10',
  info: 'bg-transparent border-sky-500 text-sky-600 hover:bg-sky-600/10',
  warning: 'bg-transparent border-amber-500 text-amber-600 hover:bg-amber-600/10',
  help: 'bg-transparent border-violet-500 text-violet-600 hover:bg-violet-600/10',
  danger: 'bg-transparent border-rose-500 text-rose-600 hover:bg-rose-600/10',
  contrast: 'bg-transparent border-white text-white hover:bg-white/10',
};

export const TEXT_COLORS: Record<string, string> = {
  primary: 'bg-transparent border-transparent text-white hover:bg-black/10',
  secondary: 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-500/10',
  success: 'bg-transparent border-transparent text-emerald-600 hover:bg-emerald-600/10',
  info: 'bg-transparent border-transparent text-sky-600 hover:bg-sky-600/10',
  warning: 'bg-transparent border-transparent text-amber-600 hover:bg-amber-600/10',
  help: 'bg-transparent border-transparent text-violet-600 hover:bg-violet-600/10',
  danger: 'bg-transparent border-transparent text-rose-600 hover:bg-rose-600/10',
  contrast: 'bg-transparent border-transparent text-white hover:bg-white/10',
};

export const SIZES: Record<string, string> = {
  small: 'size-small',
  medium: 'size-medium',
  large: 'size-large',
};
