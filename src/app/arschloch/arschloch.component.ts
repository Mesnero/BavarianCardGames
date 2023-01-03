import { Component, OnInit } from '@angular/core';
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {CarddeckService} from "../carddeck.service";

@Component({
  selector: 'app-arschloch',
  templateUrl: './arschloch.component.html',
  styleUrls: ['./arschloch.component.css'],
  animations: [
    trigger('cardIn', [
    transition(':enter', [
      animate('400ms', keyframes([
        style({transform: 'translateY(1000px)', offset: 0}),
        style({transform: 'translateY(0) translateX(0)', offset: 1}),
      ]))])])]
})

export class ArschlochComponent implements OnInit {
  cardsPlayer: any[] = [];


  constructor(private cardDeck: CarddeckService) {
  }
  ngOnInit(): void {
    this.dealCards();
  }

  private dealCards() {
    let deck = this.cardDeck.getShuffledDeck();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.cardsPlayer.push(deck.pop());
      }, i * 500);
    }
  }

}
