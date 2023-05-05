import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {StartComponent} from "./start/start.component";
import {ParisComponent} from "./paris/paris.component";
import {ArschlochComponent} from "./arschloch/arschloch.component";
import {ParisLobbyComponent} from "./paris/paris-lobby/paris-lobby.component";
import {TestingComponent} from "./testing/testing.component";


const routes: Routes = [
  { path: '', component: StartComponent},
  { path: '0', redirectTo: '/arschloch', pathMatch: 'full'},
  { path: 'arschloch/:id', component: ArschlochComponent},
  { path: '1', redirectTo: '/paris', pathMatch: 'full'},
  { path: 'paris/:id', component: ParisComponent},
  { path: 'lobby/paris', component: ParisLobbyComponent},
  { path: '3', component: TestingComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
