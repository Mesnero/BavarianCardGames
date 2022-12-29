import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {StartComponent} from "./start/start.component";
import {ParisComponent} from "./paris/paris.component";
import {ArschlochComponent} from "./arschloch/arschloch.component";


const routes: Routes = [
  { path: '', component: StartComponent},
  { path: '0', redirectTo: '/arschloch', pathMatch: 'full'},
  { path: 'arschloch', component: ArschlochComponent},
  { path: '1', redirectTo: '/paris', pathMatch: 'full'},
  { path: 'paris', component: ParisComponent},
  { path: '2', component: StartComponent},
  { path: '3', component: StartComponent},
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
