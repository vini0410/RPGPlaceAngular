import { Component, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isDropdownOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  get isAuthenticated(): boolean {
    return this.authService.getIsAuthenticated();
  }

  get theme(): Signal<'claro' | 'escuro'> {
    return this.themeService.theme;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.isDropdownOpen = false;
      this.router.navigate(['/login']);
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateToMyAccount() {
    this.isDropdownOpen = false;
    this.router.navigate(['/my-account']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
