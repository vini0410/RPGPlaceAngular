import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'An unexpected error occurred. Please try again later.';
      
      // Log the full error to the console for debugging
      console.error('HTTP Error:', error);

      notificationService.showError(userMessage);
      return throwError(() => error);
    })
  );
};
