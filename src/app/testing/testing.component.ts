import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {CarddeckService} from "../carddeck.service";

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css'],
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

export class TestingComponent implements OnInit {
  players: any[] = [{name: 'Johannes', money: 500}, {name: 'Hans', money: 500}, {
    name: 'Sepp',
    money: 500
  }, {name: 'Richard', money: 500},];
  currentPlayer: number = 1;
  showStich: boolean = false;
  yourTurn: boolean = true;
  playedCards: any[] = [];
  cardsPlayer: any[][] = [[], [], [], []];


  stichLoss: number = -10;
  stichPlayer: string = 'Johannes';
  moreThanOneCard: boolean = true;
  cardsRemaining: number = 0;

  constructor(private cardDeckService: CarddeckService) {
  }

  ngOnInit(): void {
    this.dealCards();
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
    return this.cardsPlayer[0].some((card) => card.color === color);
  }

  private dealCards() {
    let deck = this.cardDeckService.getShuffledDeck();

    this.cardsPlayer[0].push(deck.pop());
    this.cardsPlayer[0].push(deck.pop());
    this.cardsPlayer[0].push(deck.pop());
    this.cardsPlayer[0].push(deck.pop());
    this.cardsPlayer[0].push(deck.pop());
    this.cardsPlayer[0].push(deck.pop());
    this.cardsPlayer[0].push(deck.pop());
    this.cardsPlayer[0].push(deck.pop());

    for (let i = 0; i < 8; i++) {
      this.cardsPlayer[1].push(deck.pop());
      this.cardsPlayer[2].push(deck.pop());
      this.cardsPlayer[3].push(deck.pop());
    }
  }

}
