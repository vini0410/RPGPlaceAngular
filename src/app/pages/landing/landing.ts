import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Home } from '../home/home';
import { Dashboard } from '../dashboard/dashboard';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, Home, Dashboard],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }
}
