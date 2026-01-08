export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  phone_number?: string;
  is_active?: boolean;
  created_at?: string;
}
