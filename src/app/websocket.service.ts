import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private websocket: WebSocket;
  constructor() {
    this.websocket = new WebSocket("ws://localhost:9090");
  }

  getWebsocket(): WebSocket {
    return this.websocket;
  }
}
