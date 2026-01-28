import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { selectIsAuthenticated, selectUser } from '@core/auth/store/auth.reducer';
import type { User } from '@core/auth/models/user.model';
import { Sidebar } from './sidebar';

describe('Sidebar', () => {
  let fixture: ComponentFixture<Sidebar>;
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
      imports: [Sidebar],
      providers: [provideRouter([]), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    authSelector = store.overrideSelector(selectIsAuthenticated, false);
    userSelector = store.overrideSelector(selectUser, null);

    fixture = TestBed.createComponent(Sidebar);
    fixture.detectChanges();
  });

  it('hides user block for guest', () => {
    setAuthState(false, null);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('button[aria-haspopup="menu"]')).toBeNull();
  });

  it('shows user block and menu for authenticated user', () => {
    setAuthState(true, {
      id: 42,
      email: 'maria@example.com',
      username: 'maria',
      first_name: 'Maria',
      last_name: 'Ivanova',
    });

    const element = fixture.nativeElement as HTMLElement;
    const userButton = element.querySelector('button[aria-haspopup="menu"]') as HTMLButtonElement;
    expect(userButton).toBeTruthy();
    expect(element.textContent).toContain('maria');

    userButton.click();
    fixture.detectChanges();

    expect(element.textContent).toContain('Profile');
    expect(element.textContent).toContain('Logout');
  });
});
