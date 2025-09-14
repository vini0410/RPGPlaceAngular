import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserResponseDTO } from '../../models/user.model';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.html',
  styleUrl: './my-account.css'
})
export class MyAccount implements OnInit {
  currentUser: UserResponseDTO | null = null;
  editableUser: UserResponseDTO | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.editableUser = { ...this.currentUser }; // Create a copy for editing
    }
  }

  saveChanges() {
    if (this.editableUser && this.currentUser && this.editableUser.id) {
      const updateUserRequest = {
        name: this.editableUser.name,
        email: this.editableUser.email
      };
      this.userService.updateUser(this.currentUser.id, updatedUser).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Account updated successfully!');
          this.authService.setCurrentUser(response);
          this.currentUser = response;
        },
        error: (err) => {
          this.notificationService.showError('Failed to update account.');
          console.error(err);
        }
      });
    }
  }
}
