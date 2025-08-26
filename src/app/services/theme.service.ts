// src/app/services/theme.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private _isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme = this._isDarkTheme.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    // Carrega o tema preferido do localStorage ao iniciar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDarkTheme(true);
    } else {
      this.setDarkTheme(false);
    }
  }

  setDarkTheme(isDarkTheme: boolean): void {
    this._isDarkTheme.next(isDarkTheme);
    if (isDarkTheme) {
      this.renderer.addClass(document.body, 'dark'); // Use 'dark' class as defined in styles.scss
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark'); // Use 'dark' class as defined in styles.scss
      localStorage.setItem('theme', 'light');
    }
  }

  toggleTheme(): void {
    this.setDarkTheme(!this._isDarkTheme.value);
  }
}
