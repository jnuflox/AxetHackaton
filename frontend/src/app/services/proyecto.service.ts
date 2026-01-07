import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  Proyecto, 
  CapaUno, 
  CapaDos, 
  CapaTres, 
  CapaCuatro 
} from '../models/proyecto.model';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Proyectos
  getProyectos(): Observable<Proyecto[]> {
    return this.http.get<any>(`${this.apiUrl}/proyectos`).pipe(
      map(response => response.data)
    );
  }

  getProyecto(id: string): Observable<Proyecto> {
    return this.http.get<any>(`${this.apiUrl}/proyectos/${id}`).pipe(
      map(response => response.data)
    );
  }

  createProyecto(proyecto: Proyecto): Observable<Proyecto> {
    return this.http.post<any>(`${this.apiUrl}/proyectos`, proyecto).pipe(
      map(response => response.data)
    );
  }

  updateProyecto(id: string, proyecto: Partial<Proyecto>): Observable<Proyecto> {
    return this.http.put<any>(`${this.apiUrl}/proyectos/${id}`, proyecto).pipe(
      map(response => response.data)
    );
  }

  deleteProyecto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/proyectos/${id}`);
  }

  getDashboard(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/proyectos/${id}/dashboard`).pipe(
      map(response => response.data)
    );
  }

  // Capa Uno
  getCapaUno(proyectoId: string): Observable<CapaUno> {
    return this.http.get<any>(`${this.apiUrl}/capa-uno/${proyectoId}`).pipe(
      map(response => response.data)
    );
  }

  saveCapaUno(capaUno: CapaUno): Observable<CapaUno> {
    return this.http.post<any>(`${this.apiUrl}/capa-uno`, capaUno).pipe(
      map(response => response.data)
    );
  }

  getResumenFinanciero(capaUnoId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/capa-uno/${capaUnoId}/resumen-financiero`).pipe(
      map(response => response.data)
    );
  }

  // Capa Dos
  getCapaDos(proyectoId: string): Observable<CapaDos> {
    return this.http.get<any>(`${this.apiUrl}/capa-dos/${proyectoId}`).pipe(
      map(response => response.data)
    );
  }

  saveCapaDos(capaDos: CapaDos): Observable<CapaDos> {
    return this.http.post<any>(`${this.apiUrl}/capa-dos`, capaDos).pipe(
      map(response => response.data)
    );
  }

  getKPIs(capaDosId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/capa-dos/${capaDosId}/kpis`).pipe(
      map(response => response.data)
    );
  }

  addRiesgo(capaDosId: string, riesgo: any): Observable<CapaDos> {
    return this.http.post<any>(`${this.apiUrl}/capa-dos/${capaDosId}/riesgos`, riesgo).pipe(
      map(response => response.data)
    );
  }

  addHistorial(capaDosId: string, item: any): Observable<CapaDos> {
    return this.http.post<any>(`${this.apiUrl}/capa-dos/${capaDosId}/historial`, item).pipe(
      map(response => response.data)
    );
  }

  // Capa Tres
  getCapaTres(proyectoId: string): Observable<CapaTres> {
    return this.http.get<any>(`${this.apiUrl}/capa-tres/${proyectoId}`).pipe(
      map(response => response.data)
    );
  }

  saveCapaTres(capaTres: CapaTres): Observable<CapaTres> {
    return this.http.post<any>(`${this.apiUrl}/capa-tres`, capaTres).pipe(
      map(response => response.data)
    );
  }

  getMetricasCalidad(capaTresId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/capa-tres/${capaTresId}/metricas-calidad`).pipe(
      map(response => response.data)
    );
  }

  getDeudaTecnica(capaTresId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/capa-tres/${capaTresId}/deuda-tecnica`).pipe(
      map(response => response.data)
    );
  }

  // Capa Cuatro
  getCapaCuatro(proyectoId: string): Observable<CapaCuatro> {
    return this.http.get<any>(`${this.apiUrl}/capa-cuatro/${proyectoId}`).pipe(
      map(response => response.data)
    );
  }

  saveCapaCuatro(capaCuatro: CapaCuatro): Observable<CapaCuatro> {
    return this.http.post<any>(`${this.apiUrl}/capa-cuatro`, capaCuatro).pipe(
      map(response => response.data)
    );
  }

  getAnalisisPredictivo(capaCuatroId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/capa-cuatro/${capaCuatroId}/analisis-predictivo`).pipe(
      map(response => response.data)
    );
  }

  getRecomendaciones(capaCuatroId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/capa-cuatro/${capaCuatroId}/recomendaciones`).pipe(
      map(response => response.data)
    );
  }

  getProyeccionEconomica(capaCuatroId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/capa-cuatro/${capaCuatroId}/proyeccion-economica`).pipe(
      map(response => response.data)
    );
  }
}
