import { HttpClient } from '@angular/common/http';
import { Injectable, inject, OnDestroy } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { environment } from '@env/environment';
import { LoginRequest, SignupRequest, SignupResponse, CheckAuthResponse } from '@core/auth/models/auth-dto.model';
import { User } from '@core/auth/models/user.model';
import { map } from 'rxjs/operators';

export interface AuthMessage {
  type: 'login' | 'logout';
  payload?: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private http = inject(HttpClient);
  // Базовый URL для auth
  private authUrl = environment.apiUrl + '/auth';
  // Базовый URL для users (если эндпоинт me там)
  private usersUrl = environment.apiUrl + '/users';

  private authChannel = new BroadcastChannel('auth_channel');

  ngOnDestroy(): void {
    this.authChannel.close();
  }

  signup(data: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.authUrl}/signup`, data);
    // withCredentials при signup обычно не обязательно, если мы не ждем куку сразу,
    // но AuthInterceptor все равно добавит его, это ок.
  }

  login(data: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/login`, data);
    // Interceptor добавит withCredentials: true,
    // Бэкенд установит HttpOnly cookie.
  }

  logout(): Observable<void> {
    // Т.к. в Python нет logout endpoint, мы можем сделать фиктивный запрос
    // или реализовать его на бэке. Пока оставим запрос, чтобы Interceptor
    // послал куку, а сервер (если реализуешь) её стер.
    // Если endpoint нет, просто возвращаем of(void) или игнорируем 404.
    return this.http.post<void>(`${this.authUrl}/logout`, {});
  }

  broadcastLogout(): void {
    this.authChannel.postMessage({ type: 'logout' } as AuthMessage);
  }

  broadcastLogin(user: User): void {
    this.authChannel.postMessage({ type: 'login', payload: user } as AuthMessage);
  }

  get authMessage$(): Observable<AuthMessage> {
    return fromEvent<MessageEvent>(this.authChannel, 'message').pipe(map((event) => event.data));
  }

  checkAuth(): Observable<User> {
    // ВАЖНО: Тебе нужно создать этот endpoint в Python:
    // @router.get("/me", response_model=schemas.User)
    // async def read_users_me(current_user: User = Depends(get_current_user)):
    //     return current_user
    // Предполагаем, что он будет доступен по /api/v1/users/me или /api/v1/auth/me
    return this.http.get<CheckAuthResponse>(`${this.authUrl}/me`).pipe(map((response) => response.user_data));
  }
}
