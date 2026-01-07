import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProyectoListComponent } from './components/proyecto-list/proyecto-list.component';
import { ProyectoDetailComponent } from './components/proyecto-detail/proyecto-detail.component';
import { CapaUnoComponent } from './components/capa-uno/capa-uno.component';
import { CapaDosComponent } from './components/capa-dos/capa-dos.component';
import { CapaTresComponent } from './components/capa-tres/capa-tres.component';
import { CapaCuatroComponent } from './components/capa-cuatro/capa-cuatro.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProyectoListComponent,
    ProyectoDetailComponent,
    CapaUnoComponent,
    CapaDosComponent,
    CapaTresComponent,
    CapaCuatroComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
