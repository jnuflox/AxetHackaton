import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CapaService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCapaUno(proyectoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/capa-uno/${proyectoId}`);
  }

  getCapaDos(proyectoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/capa-dos/${proyectoId}`);
  }

  getCapaTres(proyectoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/capa-tres/${proyectoId}`);
  }

  getCapaCuatro(proyectoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/capa-cuatro/${proyectoId}`);
  }
}
