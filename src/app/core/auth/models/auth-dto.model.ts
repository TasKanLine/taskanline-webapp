import { User } from './user.model';

export interface SignupRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Исправлено под Python: schemas.UserResponse
export interface SignupResponse {
  status: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
}

// Для Login Python возвращает User model напрямую (id, email...)
// Поэтому отдельный интерфейс AuthResponse может не понадобиться,
// но для SignupSuccess в NgRx он нужен.

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}
