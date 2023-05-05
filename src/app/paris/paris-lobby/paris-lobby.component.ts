import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../../websocket.service";

@Component({
  selector: 'app-paris-lobby',
  templateUrl: './paris-lobby.component.html',
  styleUrls: ['./paris-lobby.component.css']
})
export class ParisLobbyComponent implements OnInit {
  clientId: string = '';
  gameIdJoin: string = '';
  gameIdCreate: string = '';
  error: string = '';
  private ws!: WebSocket;
  constructor(private router: Router, private wss: WebsocketService) { }

  ngOnInit(): void {
    this.ws = this.wss.getWebsocket();
    this.ws.onmessage  = message => {
      const response = JSON.parse(message.data);
      if(response.method === "connect") {
        if(localStorage.getItem("clientId") == null) {
          this.clientId = response.clientId;
          localStorage.setItem("clientId", this.clientId);
        }
        else {
          this.clientId = localStorage.getItem("clientId") || "ERROR";
        }
      }
      if(response.method === "create") {
         const gameId = response.game.id;
         this.gameIdCreate = '<h1>' + gameId + '</h1>'
      }
      if(response.method === "error") {
        const errorMsg = response.message;
        this.gameIdCreate = '<h1>' + errorMsg + '</h1>'
      }
      if(response.method === "redirect") {
         this.router.navigateByUrl('/arschloch/' + response.path);
      }
      }
  }

  createGame() {
      const payLoad = {
        "method": "create",
        "clientId": this.clientId,
        //TODO: MAKE THIS REAL VARS FROM LOGIN
        "name": "Johannes",
        "money": 500
      }
      this.ws.send(JSON.stringify(payLoad));
  }

  joinGame() {
    const payLoad = {
      "method": "join",
      "clientId": this.clientId,
      "gameId": this.gameIdJoin,
      "name": "Johannes",
      "money": 500
    }
    this.ws.send(JSON.stringify(payLoad));
  }

  clear() {
    localStorage.removeItem('clientId');
  }
}
