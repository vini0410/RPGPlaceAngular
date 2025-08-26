import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStatusService {
  private isAuthenticated = signal<boolean>(false);

  constructor() {
    // Check for token in local storage on initialization
    this.isAuthenticated.set(!!localStorage.getItem('token'));
  }

  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated.set(isAuthenticated);
    if (isAuthenticated) {
      localStorage.setItem('token', 'true'); // Replace 'true' with a real token
    } else {
      localStorage.removeItem('token');
    }
  }

  getIsAuthenticated() {
    return this.isAuthenticated();
  }
}
