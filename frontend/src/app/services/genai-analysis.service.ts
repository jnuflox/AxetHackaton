import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interfaces para tipado fuerte
export interface Conector {
  id: string;
  nombre: string;
  descripcion: string;
  estado: 'ACTIVO' | 'DISPONIBLE' | 'INACTIVO';
  icono: string;
  ultimaSync?: string;
}

export interface RiesgoPredicho {
  id: string;
  titulo: string;
  descripcion: string;
  probabilidad: number;
  impacto: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  categoria: string;
  factoresContribuyentes: string[];
  mitigacionSugerida: string;
  fechaDeteccion: string;
  tendencia: 'CRECIENTE' | 'ESTABLE' | 'DECRECIENTE';
}

export interface Recomendacion {
  id: string;
  tipo: 'URGENTE' | 'IMPORTANTE' | 'MEJORA' | 'OPTIMIZACION';
  titulo: string;
  descripcion: string;
  accionRecomendada: string;
  impactoEsperado: string;
  esfuerzoEstimado: string;
  prioridad: number;
  areaAfectada: string;
}

export interface Alerta {
  id: string;
  tipo: 'CRITICA' | 'ADVERTENCIA' | 'INFO';
  mensaje: string;
  origen: string;
  timestamp: string;
  leida: boolean;
}

export interface ResumenEjecutivo {
  estadoGeneral: 'CRITICO' | 'EN_RIESGO' | 'ESTABLE' | 'OPTIMO';
  puntuacionSalud: number;
  tendenciaProyecto: 'MEJORANDO' | 'ESTABLE' | 'DETERIORANDO';
  resumenTexto: string;
  principalesConclusiones: string[];
}

export interface GenAIAnalysisResult {
  proyectoId: string;
  timestamp: string;
  conectoresAnalizados: string[];
  resumenEjecutivo: ResumenEjecutivo;
  riesgosPredichos: RiesgoPredicho[];
  recomendaciones: Recomendacion[];
  alertas: Alerta[];
  metricas: {
    confianzaModelo: number;
    datosAnalizados: number;
    tiempoAnalisis: number;
  };
  proximoAnalisisSugerido: string;
}

export interface AnalysisRequest {
  conectoresSeleccionados: string[];
  incluirHistorial?: boolean;
  nivelDetalle?: 'BASICO' | 'DETALLADO' | 'EXHAUSTIVO';
}

@Injectable({
  providedIn: 'root'
})
export class GenAIAnalysisService {
  private readonly apiUrl = environment.apiUrl || 'http://localhost:3001/api';
  
  // Estado del análisis
  private analysisInProgress = new BehaviorSubject<boolean>(false);
  private lastAnalysisResult = new BehaviorSubject<GenAIAnalysisResult | null>(null);
  private selectedConnectors = new BehaviorSubject<string[]>([]);
  
  // Observables públicos
  public analysisInProgress$ = this.analysisInProgress.asObservable();
  public lastAnalysisResult$ = this.lastAnalysisResult.asObservable();
  public selectedConnectors$ = this.selectedConnectors.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de conectores disponibles
   */
  getConectores(): Observable<Conector[]> {
    return this.http.get<{ success: boolean; data: Conector[] }>(`${this.apiUrl}/capa-cuatro/config/conectores`).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  /**
   * Ejecuta el análisis GenAI para un proyecto
   */
  analyzeWithGenAI(
    proyectoId: number | string,
    request: AnalysisRequest
  ): Observable<GenAIAnalysisResult> {
    this.analysisInProgress.next(true);
    
    return this.http.post<{ success: boolean; data: GenAIAnalysisResult }>(
      `${this.apiUrl}/capa-cuatro/${proyectoId}/analyze-genai`,
      request
    ).pipe(
      map(response => response.data),
      tap(result => {
        this.lastAnalysisResult.next(result);
        this.analysisInProgress.next(false);
      }),
      catchError(error => {
        this.analysisInProgress.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Obtiene los insights GenAI guardados para un proyecto
   */
  getGenAIInsights(proyectoId: number | string): Observable<GenAIAnalysisResult> {
    return this.http.get<{ success: boolean; data: GenAIAnalysisResult }>(
      `${this.apiUrl}/capa-cuatro/${proyectoId}/genai-insights`
    ).pipe(
      map(response => response.data),
      tap(result => this.lastAnalysisResult.next(result)),
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza la selección de conectores
   */
  setSelectedConnectors(connectorIds: string[]): void {
    this.selectedConnectors.next(connectorIds);
  }

  /**
   * Agrega un conector a la selección
   */
  toggleConnector(connectorId: string): void {
    const current = this.selectedConnectors.value;
    const index = current.indexOf(connectorId);
    
    if (index === -1) {
      this.selectedConnectors.next([...current, connectorId]);
    } else {
      this.selectedConnectors.next(current.filter(id => id !== connectorId));
    }
  }

  /**
   * Verifica si un conector está seleccionado
   */
  isConnectorSelected(connectorId: string): boolean {
    return this.selectedConnectors.value.includes(connectorId);
  }

  /**
   * Obtiene el color según el nivel de impacto/riesgo
   */
  getImpactColor(impact: string): string {
    const colors: Record<string, string> = {
      'CRITICO': '#dc3545',
      'ALTO': '#fd7e14',
      'MEDIO': '#ffc107',
      'BAJO': '#28a745'
    };
    return colors[impact] || '#6c757d';
  }

  /**
   * Obtiene el color según el estado general
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'CRITICO': '#dc3545',
      'EN_RIESGO': '#fd7e14',
      'ESTABLE': '#17a2b8',
      'OPTIMO': '#28a745'
    };
    return colors[status] || '#6c757d';
  }

  /**
   * Obtiene el icono según el tipo de recomendación
   */
  getRecommendationIcon(tipo: string): string {
    const icons: Record<string, string> = {
      'URGENTE': 'warning',
      'IMPORTANTE': 'priority_high',
      'MEJORA': 'trending_up',
      'OPTIMIZACION': 'tune'
    };
    return icons[tipo] || 'info';
  }

  /**
   * Formatea la fecha para mostrar
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Limpia el resultado del último análisis
   */
  clearLastAnalysis(): void {
    this.lastAnalysisResult.next(null);
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error ${error.status}: ${error.message}`;
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('GenAI Analysis Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
