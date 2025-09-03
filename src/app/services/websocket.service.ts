import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private connection$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService) {}

  connect(): Observable<boolean> {
    if (this.stompClient && this.stompClient.connected) {
      this.connection$.next(true);
      return this.connection$.asObservable();
    }

    const token = this.authService.getToken();

    const serverUrl = `http://localhost:8080/ws?token=${token}`;
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    this.stompClient.connect(headers, (frame) => {
      this.connection$.next(true);
    }, (error) => {
      console.error('Connection error: ' + error);
      this.connection$.next(false);
    });

    return this.connection$.asObservable();
  }

  disconnect() {
    if (this.stompClient) {
        this.stompClient.disconnect(() => {
        this.connection$.next(false);
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
