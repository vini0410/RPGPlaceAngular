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

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        userMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          userMessage = 'Could not connect to the server. Please check your network connection.';
        } else if (error.status === 400) {
          userMessage = 'Invalid request. Please check the data you are sending.';
        } else if (error.status === 401) {
          userMessage = 'You are not authorized to perform this action.';
        } else if (error.status === 403) {
          userMessage = 'You do not have permission to access this resource.';
        } else if (error.status === 404) {
          userMessage = 'The requested resource was not found.';
        } else if (error.status >= 500) {
          userMessage = 'A server error occurred. Please try again later.';
        }
      }
      
      // Log the full error to the console for debugging
      console.error('HTTP Error:', error);

      notificationService.showError(userMessage);
      return throwError(() => error);
    })
  );
};
