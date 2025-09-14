import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { HeaderService } from '../../services/header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {
  isDropdownOpen = false;
  tableName: string | null = null;
  private tableNameSubscription: Subscription | undefined;
  isAuthenticated: Signal<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private headerService: HeaderService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    this.tableNameSubscription = this.headerService.tableName$.subscribe(name => {
      this.tableName = name;
    });
  }

  ngOnDestroy(): void {
    if (this.tableNameSubscription) {
      this.tableNameSubscription.unsubscribe();
    }
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
