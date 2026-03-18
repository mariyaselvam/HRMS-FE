import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { App } from './app';
import { ThemeService } from './core/services/theme.service';
import { AuthService } from './core/services/auth.service';
import { provideRouter } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { vi } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    const themeServiceMock = {
      isDarkMode: signal(false),
      toggleTheme: vi.fn()
    };
    const authServiceMock = {
      isLoggedIn: signal(true),
      logout: vi.fn(),
      user: signal({ email: 'test@example.com' }),
      userRole: signal('ADMIN')
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render logout button when logged in', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Logout');
  });
});
