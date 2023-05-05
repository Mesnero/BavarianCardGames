import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CarddeckService} from "../carddeck.service";
import {ActivatedRoute, Router} from "@angular/router";
import {WebsocketService} from "../websocket.service";


@Component({
  selector: 'app-arschloch',
  templateUrl: './arschloch.component.html',
  styleUrls: ['./arschloch.component.css'],
  animations: [
    trigger('slideInOutAnimation', [
      state('in', style({transform: 'translateY(0)'})),
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('0.5s ease-in-out')
      ]),
      transition(':leave', [
        animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
      ])
    ]),
    trigger('slideInBottom', [
      state('in', style({ transform: 'translateY(200%)' })),
      transition(':enter', [
        style({ transform: 'translateY(200%)' }),
        animate('0.5s ease-in-out')
      ]),
      transition(':leave', [
        animate('0.5s ease-in-out', style({ transform: 'translateY(200%)' }))
      ])
    ])
  ]
})

export class ArschlochComponent implements OnInit {
  cardPlayer: any[][] = [[], [], [], []];
  players: any[] = [];
  playedCards: any[] = [];
  clientId: string = '';
  gameId: string = '';
  phase: number = 0;
  private ws!: WebSocket;
  playerNumber: number = -1;
  stichLoss: number = 0;
  stichPlayer: string = '';

  //SET TO TRUE WHEN STICH IS COMPLETED
  showStich: boolean = false;
  yourTurn: boolean = false;
  currentPlayer: number = -1;
  moreThanOneCard: boolean = false;
  cardsRemaining: number = 0;

  constructor(private cardDeck: CarddeckService, private route: ActivatedRoute, private router: Router, private wss: WebsocketService) {
  }

  ngOnInit(): void {
    setInterval(() => {
        this.updateWaiting();
      }, 1000
    );

    this.ws = this.wss.getWebsocket();
    if (localStorage.getItem("clientId") != null) {
      this.clientId = localStorage.getItem("clientId") || "ERROR"; //TODO: SOMETHING WRONG WHEN REFRESHING
    }
    this.route.paramMap.subscribe((params) => {
      this.gameId = params.get('id') || ''; //TODO: ROUTING TO PARIS WON'T WORK
    });
    this.ws.onmessage = message => {
      const response = JSON.parse(message.data);
      if (response.method === "connect") {
        this.connectNewPlayer(response);
      }
      if (response.method === "error") {
        this.router.navigateByUrl('/');
      }
      if (response.method === "join") {
        this.anotherPlayerJoined(response);
      }
      if (response.method === "startGame") {
        this.startGame(response);
      }
      if (response.method === "playedCard") {
        this.updateAfterPlayed(response);
      }
      if (response.method === "stich") {
        this.endStich(response);
      }
      if (response.method === "phase") {
        this.nextRound(response);
      }
    }
  }

  private anotherPlayerJoined(response: any) {
    const clients = response.game.clients;
    this.playerNumber = clients.filter((c: any) => c.clientId === this.clientId)[0].playerNumber;
    this.players = [];
    for (let i = 0; i < 4; i++) {
      const playerIndex = (i + this.playerNumber) % 4;
      if (playerIndex < clients.length) {
        this.players.push({name: clients[playerIndex].name, money: clients[playerIndex].money});
      } else {
        this.players.push(null);
      }
    }
  }

  private updateAfterPlayed(response: any) {
    this.cardPlayer[0] = response.cards;
    this.yourTurn = response.yourTurn;
    this.playedCards = response.game.cardsPlayed;
    let playedBy: number;
    if (response.playedBy < 0) {
      playedBy = Math.abs(response.playedBy);
      this.currentPlayer = -1;
    } else {
      playedBy = response.playedBy;
      this.currentPlayer = (this.currentPlayer + 1) % 4;
    }
    if (playedBy !== this.playerNumber) {
      this.cardPlayer[(playedBy + 4 - this.playerNumber) % 4].pop();
    }
    else {
      this.cardsRemaining--;
      if(response.game.round == 8) {
        this.moreThanOneCard = false;
      }
    }
  }

  private endStich(response: any) {
    this.playedCards = [];
    this.yourTurn = response.yourTurn;
    this.currentPlayer = (response.looser + 4 - this.playerNumber) % 4
    this.players[this.currentPlayer].money += response.money;
    this.stichLoss = response.lostMoney;
    this.stichPlayer = this.players[this.currentPlayer];
    this.showStich = true;
    setTimeout(() => {
      this.showStich = false;
    }, 2000);
  }

  private connectNewPlayer(response: any) {
    if (localStorage.getItem("clientId") == null) {
      this.clientId = response.clientId;
      localStorage.setItem("clientId", this.clientId);
      const payLoad = {
        "method": "join",
        "clientId": this.clientId,
        "gameId": this.gameId,
        //TODO MAKE NAME AND MONEY
        "name": "Johannes",
        "money": 500
      }
      this.ws.send(JSON.stringify(payLoad));
    }
  }

  private startGame(response: any) {
    this.cardPlayer[0] = response.cards;
    this.cardPlayer[1] = [1, 2, 3, 4, 5, 6, 7, 8];
    this.cardPlayer[2] = [1, 2, 3, 4, 5, 6, 7, 8];
    this.cardPlayer[3] = [1, 2, 3, 4, 5, 6, 7, 8];
    this.yourTurn = response.yourTurn;
    this.phase = response.game.phase;
    this.playedCards = response.game.cardsPlayed;
    this.currentPlayer = (response.game.currentPlayer + 4 - this.playerNumber) % 4
    this.moreThanOneCard = true;
    this.cardsRemaining = 8;
  }

  playCard(card: any) {
    const payLoad = {
      "method": "playCard",
      "clientId": this.clientId,
      "gameId": this.gameId,
      "card": card
    }
    this.ws.send(JSON.stringify(payLoad));
  }

  margin(i: number) {
    return (Math.abs(i - 3.5) - 3.5) * 10 + 'px 0px 0px -120px';
  }

  rotate(i: number) {
    return 10 * i - 60 + 'deg';
  }

  rotateSym(i: number) {
    return 10 * i - 37 + 'deg';
  }

  rotatePlayed(i: number) {
    return 'rotate(' + (i * 60 - 30) + 'deg)';
  }

  leftCards(i: number) {
    return 'calc(30% + ' + (10 * i - 30) + 'px )'
  }

  waitingAnimation: string = "Warten auf Spieler";

  private updateWaiting() {
    const updateAnimation = (this.waitingAnimation.length - 17) % 4;
    this.waitingAnimation = `Warten auf Spieler${'.'.repeat(updateAnimation)}`;
  }


  playable(card: string) {
    if (card === 'Played') {
      return false;
    }
    if (this.playedCards.length === 0) {
      return true;
    }
    const color = this.playedCards[0].color;
    return this.haveColor(color) && card[0] === color;
  }

  private haveColor(color: string) {
    return this.cardPlayer[0].some((card) => card.color === color);
  }


  private nextRound(response: any) {
    this.cardPlayer[0] = response.cards;
    this.cardPlayer[1] = [1, 2, 3, 4, 5, 6, 7, 8];
    this.cardPlayer[2] = [1, 2, 3, 4, 5, 6, 7, 8];
    this.cardPlayer[3] = [1, 2, 3, 4, 5, 6, 7, 8];
    this.cardsRemaining = 8;
    this.phase = response.game.phase;
    this.currentPlayer = (response.game.currentPlayer + 4 - this.playerNumber) % 4;
    this.moreThanOneCard = true;
  }
}
