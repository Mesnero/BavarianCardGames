import { Component, OnInit } from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {CarddeckService} from "../carddeck.service";

@Component({
  selector: 'app-paris',
  templateUrl: './paris.component.html',
  styleUrls: ['./paris.component.css'],
  animations: [
    trigger('open', [
      transition(':enter', [
        style({opacity: 0}),
        animate('1000ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('1000ms', style({opacity: 0}))
      ])
    ]),
    trigger('cardIn', [
      transition(':enter', [
        animate('250ms', keyframes([
            style({transform: 'translateY(1000px)', offset: 0}),
            style({transform: 'translateY(0) translateX(0)', offset: 1}),
          ]))])])
  ]
})
export class ParisComponent implements OnInit {
  showTutorial: boolean = true;
  showGame1: boolean = false;
  currentCardsPlayer1: any[] = [];
  currentCardsPlayer2: any[] = [];
  currentCardsPlayer3: any[] = [];
  currentCardsPlayer4: any[] = [];
  player: any[] = [{name: 'Jojo', money: 500}, {name: 'Mane', money: 500}, {name: 'Sepp', money: 500}, {name: 'Bäda', money: 500}];
  currentPlayer: number = -1;
  playedCard: any[] = [];
  cardsPlayed: number = 0;
  phase: number = 1;
  round: number = -1;
  moneyString: string = ' (-10ct)';
  showStich: boolean = false;
  looser: number = -1;
  beginPlayer: number = 0;
  headingPhases: string[] = [];
  textPhases: string[] = [];

  constructor(private cardDeck: CarddeckService) {
  }

  ngOnInit(): void {
      this.setText();
  }

  dealCards() {
    let deck = this.cardDeck.getShuffledDeck();
    for(let i = 0; i < 8; i++) {
        setTimeout(()=>{this.currentCardsPlayer1.push(deck.pop());},250+i*1000);
        setTimeout(()=>{this.currentCardsPlayer2.push(deck.pop());},500+i*1000);
        setTimeout(()=>{this.currentCardsPlayer3.push(deck.pop());},750+i*1000);
        setTimeout(()=>{this.currentCardsPlayer4.push(deck.pop());},1000+i*1000);
    }
    setTimeout(()=>{this.showGame1 = true; this.round=0;}, 9000)
  }

  startGame() {
    this.beginPlayer = Math.floor(Math.random() * 4);
    this.currentPlayer = this.beginPlayer;
  }

  playCard(i: number) {
    if (this.currentPlayer == 0) {
      this.playedCard.push(this.currentCardsPlayer1[i]);
      this.currentCardsPlayer1[i] = {value: 'Played', score: -1, color: 'NA'};
    } else if (this.currentPlayer == 1) {
      this.playedCard.push(this.currentCardsPlayer2[i]);
      this.currentCardsPlayer2[i] = {value: 'Played', score: -1, color: 'NA'};
    } else if (this.currentPlayer == 2) {
      this.playedCard.push(this.currentCardsPlayer3[i]);
      this.currentCardsPlayer3[i] = {value: 'Played', score: -1, color: 'NA'};
    } else if (this.currentPlayer == 3) {
      this.playedCard.push(this.currentCardsPlayer4[i]);
      this.currentCardsPlayer4[i] = {value: 'Played', score: -1, color: 'NA'};
    }
    this.cardsPlayed++;
    this.currentPlayer = (this.currentPlayer + 1) % 4;
    if (this.cardsPlayed == 4) {
      this.round++;
      this.looser = this.determineLooser();
      this.cardsPlayed = 0;
      this.currentPlayer = -1;
      this.subtractLost();
      this.showStich = true;
      setTimeout(() => {
        this.playedCard = [];
        this.showStich = false;
        this.currentPlayer = this.looser;
        if (this.round == 8) {
          this.nextPhase();
        }
      }, 2500);
    }
  }

  private subtractLost() {
      if(this.phase == 1) {
        this.player[this.looser].money -= 10;
        this.moneyString = ' (-10ct)'
      }
      if(this.phase == 2) {
        let amount = 0;
        for(let i = 0; i < 4; i++) {
          if(this.playedCard[i].color == 'H') {
            amount += 10;
          }
        }
        if(amount != 0) {
          this.moneyString = ' (-' + amount + 'ct)'
        }
        else {
          this.moneyString = '';
        }
        this.player[this.looser].money -= amount;
      }
      if(this.phase == 3) {
        let amount = 0;
        for(let i = 0; i < 4; i++) {
          if(this.playedCard[i].score == 5) {
            amount += 20;
          }
        }
        if(amount != 0) {
          this.moneyString = ' (-' + amount + 'ct)'
        }
        else {
          this.moneyString = '';
        }
        this.player[this.looser].money -= amount;
      }
      if(this.phase == 5) {
        if(this.round == 8) {
          this.player[this.looser].money -= 80;
          this.moneyString = ' (-80ct)'
        }
        else {
          this.moneyString = '';
        }
      }
      if(this.phase == 4) {
        this.moneyString = '';
        for(let i = 0; i < 4; i++) {
          if(this.playedCard[i].value == 'HK') {
            this.player[this.looser].money -= 80;
            this.moneyString = ' (-80ct)'
            //TODO: EXIT ROUND
          }
        }
      }
  }

  determineLooser() {
      let win = this.playedCard[0];
      let loosePlayer = this.currentPlayer;
      for(let i = 1; i < 4; i++ ) {
        if(win.color === this.playedCard[i].color) {
            if(win.score < this.playedCard[i].score) {
                win = this.playedCard[i];
                loosePlayer = this.currentPlayer + i;
            }
        }
      }
      return loosePlayer % 4;

  }


  playable(card: string) {
    if(card === 'Played') {
      return false;
    }
    if(this.playedCard.length != 0) {
        let color = this.playedCard[0].color;
        if(this.haveColor(color)) {
            return card[0] === color;
        }
    }
    return true;
  }

  private haveColor(color: string) {
    let currentCards = [];
    if(this.currentPlayer == 0) currentCards = this.currentCardsPlayer1;
    if(this.currentPlayer == 1) currentCards = this.currentCardsPlayer2;
    if(this.currentPlayer == 2) currentCards = this.currentCardsPlayer3;
    if(this.currentPlayer == 3) currentCards = this.currentCardsPlayer4;
    for(let i = 0; i < currentCards.length; i++) {
        if(currentCards[i].color === color) {
          return true;
        }
      }
    return false;
  }

  private nextPhase() {
    this.currentCardsPlayer1 = [];
    this.currentCardsPlayer2 = [];
    this.currentCardsPlayer3 = [];
    this.currentCardsPlayer4 = [];
    this.round = 0;
    this.dealCards();
    this.currentPlayer = -1;
    this.phase++;
    this.moneyString = '';
  }

  private setText() {
    this.headingPhases = ['Jeder Stich:', 'Jedes Herz:', 'Ober:', 'Herz König:', 'Letzter Stich:', 'Unterlegen:'];
    this.textPhases = ['In der ersten Spielrunde sollte der Spieler vermeiden einen Stich zu machen. Jeder Stich kostet 10 Cent.\n' +
    'Versuche möglichst schnell deine hohen Karten zu spielen ohne den Stich zu machen!',
    'In der zweiten Spielrunde muss des Spieler jedes Herz in seinem Stich vermeiden. Jedes Herz kostet 10 Cent.\n' +
    'Versuche also nicht auf zu viel Herz sitzenzubleiben!',
    'In der dritten Spielrunde kostet jeder Ober (O bzw. Bier-Symbol) 20 Cent.\n' + 'Du kannst versuchen deine Ober Karten anderen hinzu zuschmeißen!',
    'In der vierten Spielrunde solltest du den Max, also den Herz König im Stich vermeiden! Dieser kostet 80 Cent!\n' + 'Niedriges Herz anzuspielen könnte die Karte hinauslocken und dich überstechen!',
    'Zu guter letzt: Der letzte Stich zahlt 80 Cent!\nDu kannst in den ersten sieben Spielzügen taktisch hohe Karten loswerden um am Ende kein Pech zu haben!'
    ];
  }

}

