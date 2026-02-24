import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'hrms-theme';
    isDarkMode = signal<boolean>(this.getInitialTheme());

    constructor() {
        effect(() => {
            const mode = this.isDarkMode();
            if (mode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem(this.THEME_KEY, 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem(this.THEME_KEY, 'light');
            }
        });
    }

    toggleTheme() {
        this.isDarkMode.update(mode => !mode);
    }

    private getInitialTheme(): boolean {
        const saved = localStorage.getItem(this.THEME_KEY);
        if (saved) {
            return saved === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
}
