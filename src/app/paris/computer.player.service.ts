import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComputerPlayerService {

  constructor() {}

  chooseCard(cardsPlayed: any[], myCards: any[], round: number) {
    switch (round) {
      case 1 : return this.chooseRound1(cardsPlayed, myCards);
      case 2 : return this.chooseRound2(cardsPlayed, myCards);
      case 3 : return this.chooseRound3(cardsPlayed, myCards);
      case 4 : return this.chooseRound4(cardsPlayed, myCards);
      case 5 : return this.chooseRound5(cardsPlayed, myCards);
    }
    return -1;
  }

  private chooseRound1(cardsPlayed: any[], myCards: any[]) {
    let playableCards = myCards.filter(card => this.playable(card.value, cardsPlayed, myCards));
    if(playableCards.length == 1) {
      return this.findIndex(playableCards[0], myCards);
    }
    if(cardsPlayed.length == 0) {
       playableCards.sort((card1, card2) => card1.score - card2.score);
       return this.findBestFit(playableCards, myCards);
    }
    if(!this.haveColor(cardsPlayed[0].color, myCards)) {
      playableCards.sort((card1, card2) => card2.score - card1.score);
      return this.findBestFit(playableCards, myCards);
    }
    let beatingCard = this.findBeatingCard(cardsPlayed);
    playableCards.sort((card1, card2) => card2.score - card1.score);
    let lowerCards = playableCards.filter(card => card.score < beatingCard.score);
    if(lowerCards.length != 0) {
      return this.findIndex(lowerCards[0], myCards);
    }
    let higherCards = playableCards.filter(card => card.score > beatingCard.score);
    if(cardsPlayed.length == 3) {
      return this.findIndex(higherCards[0], myCards);
    }
    return this.findIndex(higherCards[higherCards.length-1], myCards);
  }



  private chooseRound2(cardsPlayed: any[], myCards: any[]) {
    let playableCards = myCards.filter(card => this.playable(card.value, cardsPlayed, myCards));
    if(playableCards.length == 1) {
      return this.findIndex(playableCards[0], myCards);
    }
    if(cardsPlayed.length == 0) {
      playableCards.sort((card1, card2) => card1.score - card2.score);
      for(let i = 0; i < playableCards.length; i++) {
        if(playableCards[i] == 'H7' || playableCards[i] == 'H8' || playableCards[i] == 'H9') {
          return this.findIndex(playableCards[i], myCards);
        }
      }
      return this.findBestFit(playableCards, myCards);
    }
    if(!this.haveColor(cardsPlayed[0].color, myCards)) {
      playableCards.sort((card1, card2) => card2.score - card1.score);
      if(this.haveColor('H', myCards)) {
        playableCards = playableCards.filter(card => card.color == 'H');
        return this.findIndex(playableCards[0], myCards);
      }
      return this.findBestFit(playableCards, myCards);
    }
    let beatingCard = this.findBeatingCard(cardsPlayed);
    playableCards.sort((card1, card2) => card2.score - card1.score);
    let lowerCards = playableCards.filter(card => card.score < beatingCard.score);
    if(lowerCards.length != 0) {
      return this.findIndex(lowerCards[0], myCards);
    }
    let higherCards = playableCards.filter(card => card.score > beatingCard.score);
    if(cardsPlayed.length == 3) {
      return this.findIndex(higherCards[0], myCards);
    }
    return this.findIndex(higherCards[higherCards.length-1], myCards);
  }

  private chooseRound3(cardsPlayed: any[], myCards: any[]) {
    let playableCards = myCards.filter(card => this.playable(card.value, cardsPlayed, myCards));
    if(playableCards.length == 1) {
      return this.findIndex(playableCards[0], myCards);
    }
    if(cardsPlayed.length == 0) {
      playableCards.sort((card1, card2) => card1.score - card2.score);
      let withoutO = playableCards.filter(card => card != 5);
      if(withoutO.length == 0) {
        return this.findIndex(playableCards[0], myCards);
      }
      return this.findBestFit(withoutO, myCards);
    }
    if(!this.haveColor(cardsPlayed[0].color, myCards)) {
      playableCards.sort((card1, card2) => card2.score - card1.score);
      for(let i = 0; i < playableCards.length; i++) {
        if(playableCards[i].score == 5) {
          return this.findIndex(playableCards[i], myCards);
        }
      }
      return this.findBestFit(playableCards, myCards);
    }
    let beatingCard = this.findBeatingCard(cardsPlayed);
    playableCards.sort((card1, card2) => card2.score - card1.score);
    let lowerCards = playableCards.filter(card => card.score < beatingCard.score);
    if(lowerCards.length != 0) {
      if(lowerCards.length != 1 && lowerCards[1].score == 5) {
        return this.findIndex(lowerCards[1], myCards);
      }
      return this.findIndex(lowerCards[0], myCards);
    }
    let higherCards = playableCards.filter(card => card.score > beatingCard.score);
    let withoutO = higherCards.filter(card => card.score != 5);
    if(withoutO.length != 0) {
      if(cardsPlayed.length == 3) {
        return this.findIndex(withoutO[0], myCards);
      }
      return this.findIndex(withoutO[withoutO.length-1], myCards);
    }
    if(cardsPlayed.length == 3) {
      return this.findIndex(higherCards[0], myCards);
    }
    return this.findIndex(higherCards[higherCards.length-1], myCards);
  }

  private chooseRound4(cardsPlayed: any[], myCards: any[]) {
    let playableCards = myCards.filter(card => this.playable(card.value, cardsPlayed, myCards));
    if(playableCards.length == 1) {
      return this.findIndex(playableCards[0], myCards);
    }
    if(this.hasCard(myCards, 'HK')) {
      if(cardsPlayed.length == 0) {
        playableCards.sort((card1, card2) => card1.score - card2.score);
        let heart = playableCards.filter(card => card.color == 'H' && card.value != 'HK');
        if(heart.length != 0) {
          return this.findIndex(heart[0], myCards);
        }
        let fewestColor = playableCards.filter(card => card.color == this.countHandColor(myCards))
        return this.findIndex(fewestColor[fewestColor.length-1], myCards);
      }
      if(!this.haveColor(cardsPlayed[0].color, myCards)) {
          let hk = playableCards.filter(card => card.value == 'HK');
          return this.findIndex(hk[0], myCards);
      }
      let beatingCard = this.findBeatingCard(cardsPlayed);
      if(beatingCard.value == 'HA') {
        let hk = playableCards.filter(card => card.value == 'HK');
        return this.findIndex(hk[0], myCards);
      }
      playableCards = playableCards.filter(card => card.value != 'HK');
      return this.findIndex(playableCards[playableCards.length-1], myCards);
    }
    if(cardsPlayed.length == 0) {
      playableCards.sort((card1, card2) => card1.score - card2.score);
      let heart = playableCards.filter(card => card.color == 'H' && card.value != 'HA');
      if (heart.length != 0) {
        return this.findIndex(heart[0], myCards);
      }
      return this.findBestFit(playableCards, myCards);
    }
    if(cardsPlayed.length == 3 && !this.hasCard(cardsPlayed, 'HK') && this.hasCard(playableCards, 'HA')) {
      let ha = playableCards.filter(card => card.value == 'HA');
      return this.findIndex(ha[0], myCards);
    }
    if(!this.haveColor(cardsPlayed[0].color, myCards)) {
      playableCards.sort((card1, card2) => card2.score - card1.score);
      return this.findBestFit(playableCards, myCards);
    }
    let beatingCard = this.findBeatingCard(cardsPlayed);
    playableCards.sort((card1, card2) => card2.score - card1.score);
    let lowerCards = playableCards.filter(card => card.score < beatingCard.score);
    if(lowerCards.length != 0) {
      return this.findIndex(lowerCards[0], myCards);
    }
    let higherCards = playableCards.filter(card => card.score > beatingCard.score);
    if(cardsPlayed.length == 3) {
      return this.findIndex(higherCards[0], myCards);
    }
    return this.findIndex(higherCards[higherCards.length-1], myCards);
  }

  private chooseRound5(cardsPlayed: any[], myCards: any[]) {
    let playableCards = myCards.filter(card => this.playable(card.value, cardsPlayed, myCards));
    if(playableCards.length == 1) {
      return this.findIndex(playableCards[0], myCards);
    }
    playableCards.sort((card1, card2) => card2.score - card1.score);
    return this.findBestFit(playableCards, myCards);
  }


  private findIndex(card : any, myCards: any[]) {
    return myCards.indexOf(card);
  }


  playable(card: string, cardsPlayed: any[], myCards: any[]) {
    if (card === 'Played') {
      return false;
    }
    if (cardsPlayed.length != 0) {
      let color = cardsPlayed[0].color;
      if (this.haveColor(color, myCards)) {
        return card[0] === color;
      }
    }
    return true;
  }

  private haveColor(color: string, myCards: any[]) {
    for (let i = 0; i < myCards.length; i++) {
      if (myCards[i].color === color) {
        return true;
      }
    }
    return false;
  }

  private countColor(playableCard: any, myCards: any[]) {
    let color = playableCard.color;
    let score = 0;
    for(let i = 0; i < myCards.length; i++) {
      if(myCards[i].color == color) {
        score++;
      }
    }
    return score;
  }

  private findBeatingCard(cardsPlayed: any[]) {
    let color = cardsPlayed[0].color;
    let index = 0;
    let maximum = -1;
    for(let i = 0; i < cardsPlayed.length; i++) {
      if(cardsPlayed[i].color == color) {
          if(cardsPlayed[i].score > maximum) {
            maximum = cardsPlayed[i].score;
            index = i;
          }
      }
    }
    return cardsPlayed[index];
  }

  private findBestFit(playableCards: any[], myCards: any[]) {
    if (playableCards[0].score != playableCards[1].score) {
      return this.findIndex(playableCards[0], myCards);
    }
    let lowestScore = playableCards[0].score;
    playableCards = playableCards.filter(card => card.score == lowestScore);
    let maximum = 9;
    let index = 0;
    for (let i = 0; i < playableCards.length; i++) {
      let value = this.countColor(playableCards[i], myCards);
      if (value < maximum) {
        maximum = value;
        index = i;
      }
    }
    return this.findIndex(playableCards[index], myCards);
  }

  private hasCard(myCards: any[], card: string) {
    for(let i = 0; i < myCards.length; i++) {
      if(myCards[i].value == card) {
        return true;
      }
    }
    return false;
  }

  private countHandColor(myCards : any[]) {
    let eichel = 0;
    let gras = 0;
    let schellen = 0;
    for(let i = 0; i < myCards.length; i++) {
      if(myCards[i].color == 'E') {
        eichel++;
      }
      if(myCards[i].color == 'G') {
        gras++;
      }
      if(myCards[i].color == 'S') {
        schellen++;
      }
    }
    if(eichel == 0) {
      eichel = 10;
    }
    if(gras == 0) {
      gras = 10;
    }
    if(schellen == 0) {
      schellen = 10;
    }
    if(eichel <= schellen && eichel <= gras) {
      return 'E';
    }
    if(schellen <= gras && schellen <= eichel) {
      return 'S';
    }
    return 'G';
  }

  chooseCardFinal(playedCardsFinal: any[][], myCards: any[], playableCardsString: string[]) {
    let playableCards = myCards.filter(card => playableCardsString.includes(card.value));
    if(playableCards.length == 1) {
      return this.findIndex(playableCards[0], myCards);
    }
    let withoutU = playableCards.filter(card => card.value != 4);
    if(withoutU.length == 0) {
      let onlyU = playableCards.filter(card => card.value == 4);
      let maximum = 0;
      let index = 0;
      for(let i = 0; i < onlyU.length; i++) {
        let color = this.countColor(onlyU[i], myCards);
        if(color > maximum) {
          maximum = color;
          index = i;
        }
      }
      return this.findIndex(onlyU[index], myCards);
    }
    if(withoutU.length == 1) {
      return this.findIndex(withoutU[0], myCards);
    }
    let distance = 7;
    let index = 0;
    for(let i = 0; i < withoutU.length; i++) {
      let score = 8;
      if(withoutU[i].score < 4) {
        score = withoutU[i].score;
      }
      else {
        score = 7 - withoutU[i].score;
      }
      if(score < distance) {
        distance = score;
        index = i;
      }
    }
    return this.findIndex(withoutU[index],myCards);
  }
}

