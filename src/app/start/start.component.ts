import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {


  currentIndex = 0;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  changeCurrentIndex($event: number) {
    this.currentIndex = $event;
  }

  changeToGamemode() {
    this.router.navigateByUrl('/' + this.currentIndex);
  }
}
