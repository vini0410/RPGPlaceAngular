import { Component, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStatusService } from '../../services/auth-status.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  constructor(
    private authStatusService: AuthStatusService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  get isAuthenticated(): boolean {
    return this.authStatusService.getIsAuthenticated();
  }

  get theme(): Signal<'claro' | 'escuro'> {
    return this.themeService.theme;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.authStatusService.setAuthenticated(false);
      this.router.navigate(['/login']);
    });
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
