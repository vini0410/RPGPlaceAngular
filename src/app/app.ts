import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('RPGPlaceAngular');
  theme = signal<'claro' | 'escuro'>('claro');

  ngOnInit() {
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
