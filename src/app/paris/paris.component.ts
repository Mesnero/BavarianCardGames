import {Component, OnInit} from '@angular/core';
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {CarddeckService} from "../carddeck.service";
import {interval, takeWhile} from "rxjs";
import {ComputerPlayerService} from "./computer.player.service";

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
  showPopup: boolean = false;
  cardsPlayer: any[][] = [[], [], [], []];
  players: any[] = [{name: 'Jojo', money: 500}, {name: 'Mane', money: 500}, {name: 'Sepp', money: 500}, {
    name: 'Bäda',
    money: 500
  }];
  currentPlayer: number = -1;
  playedCard: any[] = [];
  cardsPlayed: number = 0;
  phase: number = 0;
  round: number = -1;
  moneyString: string = ' (-10ct)';
  showStich: boolean = false;
  looser: number = -1;
  beginPlayer: number = 0;
  headingPhases: string[] = [];
  textPhases: string[] = [];


  playedCardsFinal: any[][] = [[], [], [], []];
  playableCards: string[] = ['EU'];
  playedCardPlayers: number[] = [0, 0, 0, 0];
  displayWinnings: boolean = false;
  winner: any[] = [];
  sourceMedals: string[] = ['assets/medals/first.png', 'assets/medals/second.png', 'assets/medals/third.png', 'assets/medals/forth.png'];
  sourceWinners: string[] = ['assets/medals/noMedal.png', 'assets/medals/noMedal.png','assets/medals/noMedal.png', 'assets/medals/noMedal.png'];

  constructor(private cardDeck: CarddeckService, private computer: ComputerPlayerService) {
  }

  ngOnInit(): void {
    this.initializeVars();
    this.beginPlayer = Math.floor(Math.random() * 4);
    this.showPopup = true;
    this.startComputerPlayer();
  }

  startPhase() {
    if (this.phase == 0) {
      this.phase++;
      this.dealCards();
    } else if (this.phase == 6) {
      this.findStartPlayerFinal();
    } else {
      this.currentPlayer = (this.beginPlayer + this.phase) % 4;
    }
    this.showPopup = false;
  }

  playCard(i: number) {
    if (this.phase == 6) {
      this.playCardFinal(i);
      return;
    }

    this.playedCard.push(this.cardsPlayer[this.currentPlayer][i]);

    this.cardsPlayer[this.currentPlayer].splice(i, 1);
    if(this.round % 2 == 1) {
      this.cardsPlayer[this.currentPlayer].push({value: 'Played', color: 'NaN', score: -1});
    }
    else {
      this.cardsPlayer[this.currentPlayer].unshift({value: 'Played', color: 'NaN', score: -1});
    }

    this.cardsPlayed++;
    this.currentPlayer = (this.currentPlayer + 1) % 4;
    if (this.cardsPlayed == 4) {
      this.nextStich();
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

  playable(card: string) {
    if(this.phase == 6) {
      return this.playableCards.includes(card);
    }
    if (card === 'Played') {
      return false;
    }
    if (this.playedCard.length != 0) {
      let color = this.playedCard[0].color;
      if (this.haveColor(color)) {
        return card[0] === color;
      }
    }
    return true;
  }

  private dealCards() {
    let deck = this.cardDeck.getShuffledDeck();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.cardsPlayer[0].push(deck.pop());
      }, 250 + i * 1000);
      setTimeout(() => {
        this.cardsPlayer[1].push(deck.pop());
      }, 500 + i * 1000);
      setTimeout(() => {
        this.cardsPlayer[2].push(deck.pop());
      }, 750 + i * 1000);
      setTimeout(() => {
        this.cardsPlayer[3].push(deck.pop());
      }, 1000 + i * 1000);
    }
    setTimeout(() => {
      this.showPopup = true;
      this.round = 0;
    }, 9000);
  }

  private nextStich() {
    this.round++;
    this.looser = this.determineLooser();
    this.cardsPlayed = 0;
    this.currentPlayer = -1;
    this.subtractLost();
    this.showStich = true;
  }

  private subtractLost() {
    switch (this.phase) {
      case 1:
        this.players[this.looser].money -= this.calculatePhase1();
        break;
      case 2:
        this.players[this.looser].money -= this.calculatePhase2();
        break;
      case 3:
        this.players[this.looser].money -= this.calculatePhase3();
        break;
      case 4:
        this.players[this.looser].money -= this.calculatePhase4();
        break;
      case 5:
        this.players[this.looser].money -= this.calculatePhase5();
        break;
    }
  }

  private determineLooser() {
    let win = this.playedCard[0];
    let loosePlayer = this.currentPlayer;
    for (let i = 1; i < 4; i++) {
      if (win.color === this.playedCard[i].color) {
        if (win.score < this.playedCard[i].score) {
          win = this.playedCard[i];
          loosePlayer = this.currentPlayer + i;
        }
      }
    }
    return loosePlayer % 4;

  }

  private haveColor(color: string) {
    let currentCards = this.cardsPlayer[this.currentPlayer];
    for (let i = 0; i < currentCards.length; i++) {
      if (currentCards[i].color === color) {
        return true;
      }
    }
    return false;
  }

  private nextPhase() {
    this.cardsPlayer = [[], [], [], []];
    this.round = -1;
    this.dealCards();
    this.currentPlayer = -1;
    this.phase++;
    this.moneyString = '';
  }

  private calculatePhase1() {
    this.moneyString = ' (-10ct)';
    return 10;
  }

  private calculatePhase2() {
    let amount = 0;
    for (let i = 0; i < 4; i++) {
      if (this.playedCard[i].color == 'H') {
        amount += 10;
      }
    }
    if (amount != 0) {
      this.moneyString = ' (-' + amount + 'ct)'
    } else {
      this.moneyString = '';
    }
    return amount;
  }

  private calculatePhase3() {
    let amount = 0;
    for (let i = 0; i < 4; i++) {
      if (this.playedCard[i].score == 5) {
        amount += 20;
      }
    }
    if (amount != 0) {
      this.moneyString = ' (-' + amount + 'ct)'
    } else {
      this.moneyString = '';
    }
    return amount;
  }

  private calculatePhase4() {
    this.moneyString = '';
    for (let i = 0; i < 4; i++) {
      if (this.playedCard[i].value == 'HK') {
        this.moneyString = ' (-80ct)';
        this.round = 8;
        return 80;
      }
    }
    return 0;
  }

  private calculatePhase5() {
    if (this.round == 8) {
      this.moneyString = ' (-80ct)'
      return 80;
    } else {
      this.moneyString = '';
      return 0;
    }
  }

  private initializeVars() {
    this.headingPhases = ['Scheiß Paris', 'Jeder Stich:', 'Jedes Herz:', 'Ober:', 'Herz König:', 'Letzter Stich:', 'Unterlegen:'];
    this.textPhases = ['Das Spiel "Scheiß Paris" wird in fünf Spielrunden und eine Finalrunde unterteilt.\n' +
    'Während der Spielphase wird je nach Runde Geld in den Pott eingezahlt, welches in der Finalrunde ausgespielt wird.\n' +
    'Der Stechende des vorherigen Spielzuges spielt aus. Außerdem muss die erste gelegte Farbe immer zugegeben werden.\n' +
    'Die genaueren Regeln der Runden werden davor erklärt.',
      'In der ersten Spielrunde sollte der Spieler vermeiden einen Stich zu machen. Jeder Stich kostet 10 Cent.\n' +
      'Versuche möglichst schnell deine hohen Karten zu spielen ohne den Stich zu machen!',
      'In der zweiten Spielrunde muss des Spieler jedes Herz in seinem Stich vermeiden. Jedes Herz kostet 10 Cent.\n' +
      'Versuche also nicht auf zu viel Herz sitzenzubleiben!',
      'In der dritten Spielrunde kostet jeder Ober (O bzw. Bier-Symbol) 20 Cent.\n' + 'Du kannst versuchen deine Ober Karten anderen hinzu zuschmeißen!',
      'In der vierten Spielrunde solltest du den Max, also den Herz König im Stich vermeiden! Dieser kostet 80 Cent!\n' + 'Niedriges Herz anzuspielen könnte die Karte hinauslocken und dich überstechen!',
      'Zu guter letzt: Der letzte Stich zahlt 80 Cent!\nDu kannst in den ersten sieben Spielzügen taktisch hohe Karten loswerden um am Ende kein Pech zu haben!',
      'Im Finale ist das Ziel möglichst schnell alle Karten loszuwerden.\n' +
      'Es startet der Spieler mit dem Eichel Unter in der Hand, der diesen auspielen muss. Nun kann reihum die nächst höhere oder niedrigere Karte angelegt werden.\n' +
      'Jeder Spieler kann statt anzulegen auch einen neuen Unter ins Spiel bringen, sodass eine neue Farbe zum anlegen auf dem Tisch ist.\n' +
      'Wenn man keine Karte zum ausspielen auf der Hand hat, wird man ausgelassen.'
    ];
    let noDeck = [
      {value: 'Played', score: -1, color: 'NA'},
      {value: 'Played', score: -1, color: 'NA'},
      {value: 'Played', score: -1, color: 'NA'},
      {value: 'Played', score: -1, color: 'NA'},
      {value: 'Played', score: -1, color: 'NA'},
      {value: 'Played', score: -1, color: 'NA'},
      {value: 'Played', score: -1, color: 'NA'},
      {value: 'Played', score: -1, color: 'NA'},];
    this.playedCardsFinal[0] = [...noDeck];
    this.playedCardsFinal[1] = [...noDeck];
    this.playedCardsFinal[2] = [...noDeck];
    this.playedCardsFinal[3] = [...noDeck];
  }

  private findStartPlayerFinal() {
    for (let i = 0; i < 8; i++) {
      if (this.cardsPlayer[0][i].value == 'EU') this.currentPlayer = 0;
      if (this.cardsPlayer[1][i].value == 'EU') this.currentPlayer = 1;
      if (this.cardsPlayer[2][i].value == 'EU') this.currentPlayer = 2;
      if (this.cardsPlayer[3][i].value == 'EU') this.currentPlayer = 3;
    }
    if(this.currentPlayer != 0) {
      setTimeout( () => {
      let index = this.computer.chooseCardFinal(this.playedCardsFinal, this.cardsPlayer[this.currentPlayer], this.playableCards);
      this.playCardFinal(index);
      }, 1500);
    }
  }

  private playCardFinal(i: number) {
    let currentCard = this.cardsPlayer[this.currentPlayer][i];
    this.cardsPlayer[this.currentPlayer][i] = {value: 'Played', score: -1, color: 'NA'};
    this.playedCardPlayers[this.currentPlayer]++;
    if(this.playedCardPlayers[this.currentPlayer] == 8) {
      let place = this.winner.push(this.players[this.currentPlayer])-1;
      this.sourceWinners[this.currentPlayer] = this.sourceMedals[place];
    }
    if (currentCard.color == 'H') {
      this.playedCardsFinal[0][currentCard.score] = currentCard;
    }
    if (currentCard.color == 'E') {
      this.playedCardsFinal[1][currentCard.score] = currentCard;
    }
    if (currentCard.color == 'G') {
      this.playedCardsFinal[2][currentCard.score] = currentCard;
    }
    if (currentCard.color == 'S') {
      this.playedCardsFinal[3][currentCard.score] = currentCard;
    }
    if (currentCard.value == 'EU') {
      this.playableCards.push('HU');
      this.playableCards.push('SU');
      this.playableCards.push('GU');
    }
    this.addNeighbourCards(currentCard);
    this.currentPlayer = (this.currentPlayer + 1) % 4;
    this.cardsPlayed++;
    this.passPlayer();
  }

  private addNeighbourCards(currentCard: { score: number; color: string; value: string }) {
    if(currentCard.score == 6) {
      this.playableCards.push(currentCard.color + 'A');
    }
    if(currentCard.score == 5) {
      this.playableCards.push(currentCard.color + 'K');
    }
    if(currentCard.score == 4) {
      this.playableCards.push(currentCard.color + '10');
      this.playableCards.push(currentCard.color + 'O');
    }
    if(currentCard.score == 3) {
      this.playableCards.push(currentCard.color + '9');
    }
    if(currentCard.score == 2) {
      this.playableCards.push(currentCard.color + '8');
    }
    if(currentCard.score == 1) {
      this.playableCards.push(currentCard.color + '7');
    }
  }

  private passPlayer() {
    if(this.canPlay()) {
      if(this.currentPlayer != 0) {
        setTimeout(() => {
          let index = this.computer.chooseCardFinal(this.playedCardsFinal, this.cardsPlayer[this.currentPlayer], this.playableCards);
          this.playCardFinal(index);
        }, 2000);
      }
      return;
    }
    if(this.cardsPlayed == 32) {
      this.displayWinnings = true;
      this.currentPlayer = -1;
      this.winner[0].money += 200;
      this.winner[1].money += 120;
      this.winner[2].money += 80;
      return;
    }
    if(this.playedCardPlayers[this.currentPlayer] == 8) {
      this.currentPlayer = (this.currentPlayer+1)%4;
      this.passPlayer();
    }
    else {
      setTimeout(() => {this.currentPlayer = (this.currentPlayer+1)%4; this.passPlayer();}, 1500);
    }
  }

  private canPlay() {
    let currentCardDeck = this.cardsPlayer[this.currentPlayer];
    let playable = 0;
    for(let i = 0; i < currentCardDeck.length; i++) {
      if(this.playable(currentCardDeck[i].value)) {
        playable++;
      }
    }
    return playable != 0;
  }

  resetGame() {
    this.showPopup = false;
    this.cardsPlayer = [[], [], [], []];
    this.currentPlayer = -1;
    this.playedCard = [];
    this.cardsPlayed = 0;
    this.phase = 0;
    this.round = -1;
    this.moneyString = ' (-10ct)';
    this.showStich = false;
    this.looser = -1;
    this.beginPlayer = 0;
    this.initializeVars();
    this.playedCardsFinal = [[], [], [], []];
    this.playableCards = ['EU'];
    this.playedCardPlayers = [0, 0, 0, 0];
    this.displayWinnings = false;
    this.winner = [];
    this.sourceMedals = ['assets/medals/first.png', 'assets/medals/second.png', 'assets/medals/third.png', 'assets/medals/forth.png'];
    this.sourceWinners = ['assets/medals/noMedal.png', 'assets/medals/noMedal.png','assets/medals/noMedal.png', 'assets/medals/noMedal.png'];
    this.beginPlayer = Math.floor(Math.random() * 4);
    this.showPopup = true;
  }

  private startComputerPlayer() {
    interval(1500).pipe(takeWhile(() => true)).subscribe(() => {
        if(this.currentPlayer != 0 && this.currentPlayer != -1){
           if(this.phase != 6) {
             setTimeout(() => {
               let index = this.computer.chooseCard(this.playedCard, this.cardsPlayer[this.currentPlayer], this.phase);
               this.playCard(index);
             }, 500)
           }
        }
    });
  }

  isPlayed(card: any) {
    if(card.value == 'Played') {
      return ' played';
    }
    return '';
  }
}

