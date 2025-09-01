import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  showSuccess(message: string) {
    this.showNotification(message, 'success');
  }

  showError(message: string) {
    this.showNotification(message, 'error');
  }

  private showNotification(message: string, type: 'success' | 'error') {
    const notification = document.createElement('div');
    notification.innerText = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = type === 'success' ? '#48bb78' : '#f56565'; // Green for success, Red for error
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }
}
