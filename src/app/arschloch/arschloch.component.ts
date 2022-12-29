import { Component, OnInit } from '@angular/core';
import {animate, keyframes, style, transition, trigger, state} from "@angular/animations";
import {CarddeckService} from "../carddeck.service";

@Component({
  selector: 'app-arschloch',
  templateUrl: './arschloch.component.html',
  styleUrls: ['./arschloch.component.css'],
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

export class ArschlochComponent implements OnInit {

  playedCardHeart: any[] = [];
  playedCardSchellen: any[] = [];
  playedCardEichel: any[] = [];
  playedCardGras: any[] = [];
  currentCardsPlayer1: any[] = [];
  currentCardsPlayer2: any[] = [];
  currentCardsPlayer3: any[] = [];
  currentCardsPlayer4: any[] = [];
  showFinal: boolean = false;
  currentPlayer: number = -1;
  round: boolean = false;
  playableCards: string[] = ['EU'];
  playedCards: number = 0;
  playedCardPlayers: number[] = [0,0,0,0];
  displayWinnings = false;
  constructor(private cardDeck: CarddeckService) { }

  ngOnInit(): void {
    this.setDecks();
    this.dealCards();
  }

  setDecks() {
    let noDeck = [
      { value: 'Played', score: -1, color: 'NA'},
      { value: 'Played', score: -1, color: 'NA'},
      { value: 'Played', score: -1, color: 'NA'},
      { value: 'Played', score: -1, color: 'NA'},
      { value: 'Played', score: -1, color: 'NA'},
      { value: 'Played', score: -1, color: 'NA'},
      { value: 'Played', score: -1, color: 'NA'},
      { value: 'Played', score: -1, color: 'NA'},];
    this.playedCardHeart = [...noDeck];
    this.playedCardSchellen = [...noDeck];
    this.playedCardEichel = [...noDeck];
    this.playedCardGras = [...noDeck];

  }
  /*
  dealCards() {
    let deck = this.cardDeck.getShuffledDeck();
    for(let i = 0; i < 8; i++) {
      setTimeout(()=>{this.currentCardsPlayer1.push(deck.pop());},250+i*1000);
      setTimeout(()=>{this.currentCardsPlayer2.push(deck.pop());},500+i*1000);
      setTimeout(()=>{this.currentCardsPlayer3.push(deck.pop());},750+i*1000);
      setTimeout(()=>{this.currentCardsPlayer4.push(deck.pop());},1000+i*1000);
    }
    setTimeout(()=>{this.showFinal = true;}, 9000)
  }

   */
  dealCards() {
    let deck = this.cardDeck.getShuffledDeck();
    for(let i = 0; i < 8; i++) {
      this.currentCardsPlayer1.push(deck.pop());
      this.currentCardsPlayer2.push(deck.pop());
      this.currentCardsPlayer3.push(deck.pop());
      this.currentCardsPlayer4.push(deck.pop());
    }
    this.showFinal = true;
  }

  playable(value: string) {
      return this.playableCards.includes(value);
  }

  playCard(i: number) {
    let currentCard = {value: 'Played', score: -1, color: 'NA'};
    if (this.currentPlayer == 0) {
      currentCard = this.currentCardsPlayer1[i];
      this.currentCardsPlayer1[i] = {value: 'Played', score: -1, color: 'NA'};
      this.playedCardPlayers[0]++;
    } else if (this.currentPlayer == 1) {
      currentCard = this.currentCardsPlayer2[i];
      this.currentCardsPlayer2[i] = {value: 'Played', score: -1, color: 'NA'};
      this.playedCardPlayers[1]++;
    } else if (this.currentPlayer == 2) {
      currentCard = this.currentCardsPlayer3[i];
      this.currentCardsPlayer3[i] = {value: 'Played', score: -1, color: 'NA'};
      this.playedCardPlayers[2]++;
    } else if (this.currentPlayer == 3) {
      currentCard = this.currentCardsPlayer4[i];
      this.currentCardsPlayer4[i] = {value: 'Played', score: -1, color: 'NA'};
      this.playedCardPlayers[3]++;
    }
    if (currentCard.color == 'H') {
      this.playedCardHeart[currentCard.score] = currentCard;
    }
    if (currentCard.color == 'E') {
      this.playedCardEichel[currentCard.score] = currentCard;
    }
    if (currentCard.color == 'G') {
      this.playedCardGras[currentCard.score] = currentCard;
    }
    if (currentCard.color == 'S') {
      this.playedCardSchellen[currentCard.score] = currentCard;
    }
    if (currentCard.value == 'EU') {
      this.playableCards.push('HU');
      this.playableCards.push('SU');
      this.playableCards.push('GU');
    }
    this.addNeighbourCards(currentCard);
    this.currentPlayer = (this.currentPlayer + 1) % 4;
    this.playedCards++;
    this.passPlayer();
  }




  findStartPlayer() {
      for(let i = 0; i < 8; i++) {
        if(this.currentCardsPlayer1[i].value == 'EU') this.currentPlayer = 0;
        if(this.currentCardsPlayer2[i].value == 'EU') this.currentPlayer = 1;
        if(this.currentCardsPlayer3[i].value == 'EU') this.currentPlayer = 2;
        if(this.currentCardsPlayer4[i].value == 'EU') this.currentPlayer = 3;
      }
  }

  private addNeighbourCards(currentCard: {score: number; color: string; value: string}) {
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


  private canPlay() {
    let currentCardDeck = [];
    let playable = 0;
    if(this.currentPlayer == 0) {
      currentCardDeck = this.currentCardsPlayer1;}
    if(this.currentPlayer == 1) {
      currentCardDeck = this.currentCardsPlayer2;
    }
    if(this.currentPlayer == 2) {
      currentCardDeck = this.currentCardsPlayer3;
    }
    if(this.currentPlayer == 3) {
      currentCardDeck = this.currentCardsPlayer4;
    }
    for(let i = 0; i < currentCardDeck.length; i++) {
      if(this.playable(currentCardDeck[i].value)) {
        playable++;
      }
    }
    return playable != 0;
  }

  private passPlayer() {
    if(this.canPlay()) {
      return;
    }
    if(this.gameDone()) {
        this.displayWinnings = true;
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

  private gameDone() {
     let winners = 0;
     if(this.playedCardPlayers[0] == 8) winners++;
     if(this.playedCardPlayers[1] == 8) winners++;
     if(this.playedCardPlayers[2] == 8) winners++;
     if(this.playedCardPlayers[3] == 8) winners++;

     return winners > 2;
  }
}
