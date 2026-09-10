import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'exam-tracker-theme';

  constructor() {
    const saved = localStorage.getItem(this.key);
    this.setTheme(saved === 'dark' ? 'dark' : 'light');
  }

  get isDark(): boolean {
    return document.documentElement.dataset['theme'] === 'dark';
  }

  toggle(): void {
    this.setTheme(this.isDark ? 'light' : 'dark');
  }

  private setTheme(theme: 'light' | 'dark'): void {
    document.documentElement.dataset['theme'] = theme;
    localStorage.setItem(this.key, theme);
  }
}
