import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {RouterLink, RouterOutlet} from "@angular/router";
import { StartComponent } from './start/start.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { ParisComponent } from './paris/paris.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { CardTableComponent } from './card-table/card-table.component';
import {CarddeckService} from "./carddeck.service";
import { ArschlochComponent } from './arschloch/arschloch.component';
import {ComputerPlayerService} from "./paris/computer.player.service";
import { ParisLobbyComponent } from './paris/paris-lobby/paris-lobby.component';
import {FormsModule} from "@angular/forms";
import { TestingComponent } from './testing/testing.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    ImageSliderComponent,
    ParisComponent,
    CardTableComponent,
    ArschlochComponent,
    ParisLobbyComponent,
    TestingComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        RouterOutlet,
        RouterLink,
        FormsModule
    ],
  providers: [CarddeckService, ComputerPlayerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
