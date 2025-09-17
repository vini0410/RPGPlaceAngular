import { environment } from '../../environments/environment';
import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client | null = null;
  private connectionSignal = signal<boolean>(false);
  public connection = this.connectionSignal.asReadonly();

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.stompClient && this.stompClient.active) {
        observer.next(true);
        observer.complete();
        return;
      }

      const token = this.authService.getToken();
      const wsUrl = environment.apiUrl.replace(/^http/, 'ws');
      
      this.stompClient = new Client({
        brokerURL: `${wsUrl}/ws`,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          this.connectionSignal.set(true);
          observer.next(true);
          observer.complete();
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
          this.connectionSignal.set(false);
          observer.error(false);
        },
      });

      this.stompClient.activate();
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connectionSignal.set(false);
    }
  }

  subscribe<T>(topic: string): Observable<T> {
    return new Observable<T>(observer => {
      if (this.stompClient) {
        this.stompClient.subscribe(topic, (message: IMessage) => {
          const body = JSON.parse(message.body);
          observer.next(body as T);
        });
      }
    });
  }

  send(destination: string, body: any) {
    if (this.stompClient) {
      this.stompClient.publish({ destination, body: JSON.stringify(body) });
    }
  }
}