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

  ngOnInit(): void {
  }

}
