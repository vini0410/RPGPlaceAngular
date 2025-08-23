import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('RPGPlaceAngular');
  themeText = 'Modo Claro';
  private observer!: MutationObserver;

  ngOnInit() {
    this.updateThemeText();

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          this.updateThemeText();
        }
      });
    });

    this.observer.observe(document.documentElement, {
      attributes: true
    });
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  private updateThemeText() {
    if (document.documentElement.classList.contains('dark')) {
      this.themeText = 'Modo Escuro';
    } else {
      this.themeText = 'Modo Claro';
    }
  }
}
