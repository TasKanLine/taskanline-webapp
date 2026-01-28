import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { selectIsAuthenticated, selectUser } from '@core/auth/store/auth.reducer';
import type { User } from '@core/auth/models/user.model';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;
  let store: MockStore;
  let authSelector: ReturnType<MockStore['overrideSelector']>;
  let userSelector: ReturnType<MockStore['overrideSelector']>;

  const setAuthState = (isAuthenticated: boolean, user: User | null) => {
    authSelector.setResult(isAuthenticated);
    userSelector.setResult(user);
    store.refreshState();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    authSelector = store.overrideSelector(selectIsAuthenticated, false);
    userSelector = store.overrideSelector(selectUser, null);

    fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
  });

  it('shows login/signup buttons for guest', () => {
    setAuthState(false, null);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Login');
    expect(element.textContent).toContain('Signup');
    expect(element.querySelector('button[aria-haspopup="menu"]')).toBeNull();
  });

  it('shows avatar and menu for authenticated user', () => {
    setAuthState(true, {
      id: 1,
      email: 'john@example.com',
      username: 'johndoe',
      first_name: 'John',
      last_name: 'Doe',
    });

    const element = fixture.nativeElement as HTMLElement;
    const avatarButton = element.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement;
    expect(avatarButton).toBeTruthy();
    expect(element.textContent).not.toContain('Login');
    expect(element.textContent).not.toContain('Signup');

    avatarButton.click();
    fixture.detectChanges();

    expect(element.textContent).toContain('Profile');
    expect(element.textContent).toContain('Logout');
  });
});
