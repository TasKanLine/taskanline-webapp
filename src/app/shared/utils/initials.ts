import type { User } from '@core/auth/models/user.model';

export const getUserInitials = (user: User | null | undefined): string => {
  if (!user) {
    return '';
  }

  const first = user.first_name ? user.first_name[0].toUpperCase() : '';
  const last = user.last_name ? user.last_name[0].toUpperCase() : '';

  if (first && last) {
    return `${first}${last}`;
  }
  if (first) {
    return first;
  }
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  return user.email ? user.email.substring(0, 2).toUpperCase() : '';
};
