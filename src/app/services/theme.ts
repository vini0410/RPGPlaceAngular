import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme = signal<'claro' | 'escuro'>('claro');

  constructor() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme.set('escuro');
      document.documentElement.classList.add('dark');
    }
  }

  toggleTheme() {
    this.theme.update(currentTheme => {
      const newTheme = currentTheme === 'claro' ? 'escuro' : 'claro';
      if (newTheme === 'escuro') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  }
}
