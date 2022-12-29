import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarddeckService {

  constructor() {}

  carddeck : any[] = [
    { value: 'HA', score: 7, color: 'H'},
    { value: 'HK', score: 6, color: 'H'},
    { value: 'HO', score: 5, color: 'H'},
    { value: 'HU', score: 4, color: 'H'},
    { value: 'H10', score: 3, color: 'H'},
    { value: 'H9', score: 2, color: 'H'},
    { value: 'H8', score: 1, color: 'H'},
    { value: 'H7', score: 0, color: 'H'},
    { value: 'EA', score: 7, color: 'E'},
    { value: 'EK', score: 6, color: 'E'},
    { value: 'EO', score: 5, color: 'E'},
    { value: 'EU', score: 4, color: 'E'},
    { value: 'E10', score: 3, color: 'E'},
    { value: 'E9', score: 2, color: 'E'},
    { value: 'E8', score: 1, color: 'E'},
    { value: 'E7', score: 0, color: 'E'},
    { value: 'SA', score: 7, color: 'S'},
    { value: 'SK', score: 6, color: 'S'},
    { value: 'SO', score: 5, color: 'S'},
    { value: 'SU', score: 4, color: 'S'},
    { value: 'S10', score: 3, color: 'S'},
    { value: 'S9', score: 2, color: 'S'},
    { value: 'S8', score: 1, color: 'S'},
    { value: 'S7', score: 0, color: 'S'},
    { value: 'GA', score: 7, color: 'G'},
    { value: 'GK', score: 6, color: 'G'},
    { value: 'GO', score: 5, color: 'G'},
    { value: 'GU', score: 4, color: 'G'},
    { value: 'G10', score: 3, color: 'G'},
    { value: 'G9', score: 2, color: 'G'},
    { value: 'G8', score: 1, color: 'G'},
    { value: 'G7', score: 0, color: 'G'},
  ];


  getShuffledDeck() {
    return this.shuffle(this.carddeck);
  }

  private shuffle(array: any[]) {
    array = [...array];

    for (let index = array.length - 1; index > 0; index--) {
      const newIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[newIndex]] = [array[newIndex], array[index]];
    }

    return array;
  }

}
