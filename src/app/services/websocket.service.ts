import { Injectable, signal } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private connectionSignal = signal<boolean>(false);
  public connection = this.connectionSignal.asReadonly();

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.stompClient && this.stompClient.connected) {
        observer.next(true);
        observer.complete();
        return;
      }

      const token = this.authService.getToken();
      const serverUrl = `http://localhost:8080/ws?token=${token}`;
      const ws = new SockJS(serverUrl);
      this.stompClient = Stomp.over(ws);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      this.stompClient.connect(headers, (frame) => {
        this.connectionSignal.set(true);
        observer.next(true);
        observer.complete();
      }, (error) => {
        console.error('Connection error: ' + error);
        this.connectionSignal.set(false);
        observer.error(false);
      });
    });
  }

  disconnect() {
    if (this.stompClient) {
        this.stompClient.disconnect(() => {
        this.connectionSignal.set(false);
        this.stompClient = null;
      });
    }
  }

  subscribe<T>(topic: string): Observable<T> {
    return new Observable<T>(observer => {
      if (this.stompClient) {
        this.stompClient.subscribe(topic, (message) => {
          const body = JSON.parse(message.body);
          observer.next(body as T);
        });
      }
    });
  }

  send(destination: string, body: any) {
    if (this.stompClient) {
      this.stompClient.send(destination, {}, JSON.stringify(body));
    }
  }
}
