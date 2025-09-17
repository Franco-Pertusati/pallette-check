// src/app/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'app-theme';

  // Signal con el tema actual
  private themeSignal = signal<Theme>(this.getInitialTheme());

  theme = this.themeSignal.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.storageKey, theme);
    });
  }

  toggleTheme() {
    this.themeSignal.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: Theme) {
    this.themeSignal.set(theme);
  }

  private getInitialTheme(): Theme {
    // 1. Leer de localStorage
    const stored = localStorage.getItem(this.storageKey) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;

    // 2. Leer preferencia del dispositivo
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
}
