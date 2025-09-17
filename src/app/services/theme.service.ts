import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeSignal = signal<'claro' | 'escuro'>('claro');
  public theme = this.themeSignal.asReadonly();
  public isDarkTheme = computed(() => this.themeSignal() === 'escuro');

  constructor() {
    const storedTheme = localStorage.getItem('theme') as 'claro' | 'escuro' | null;
    if (storedTheme) {
      this.themeSignal.set(storedTheme);
    }
    this.updateThemeClass();
  }

  toggleTheme() {
    this.themeSignal.update(current => (current === 'claro' ? 'escuro' : 'claro'));
    localStorage.setItem('theme', this.themeSignal());
    this.updateThemeClass();
  }

  private updateThemeClass() {
    if (this.themeSignal() === 'escuro') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

