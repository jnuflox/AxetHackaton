import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { ProyectoService } from "../../services/proyecto.service";
import { 
  GenAIAnalysisService, 
  GenAIAnalysisResult, 
  Conector,
  RiesgoPredicho,
  Recomendacion,
  Alerta
} from "../../services/genai-analysis.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-capa-cuatro",
  templateUrl: "./capa-cuatro.component.html",
  styleUrls: ["./capa-cuatro.component.scss"],
})
export class CapaCuatroComponent implements OnInit, OnDestroy {
  @Input() proyectoId!: string;
  
  // Datos existentes
  capaData: any = null;
  loading = true;
  error = "";
  filtroConector: string = "TODOS";

  // Nuevas propiedades para GenAI
  conectoresDisponibles: Conector[] = [];
  conectoresSeleccionados: string[] = [];
  genaiResult: GenAIAnalysisResult | null = null;
  genaiLoading = false;
  genaiError = "";
  mostrarPanelGenAI = true;
  nivelDetalle: 'BASICO' | 'DETALLADO' | 'EXHAUSTIVO' = 'DETALLADO';
  
  // Control de tabs del panel GenAI
  activeGenAITab: 'resumen' | 'riesgos' | 'recomendaciones' | 'alertas' = 'resumen';
  
  private destroy$ = new Subject<void>();

  constructor(
    private proyectoService: ProyectoService,
    private genaiService: GenAIAnalysisService
  ) {}

  ngOnInit(): void {
    this.loadCapaData();
    this.loadConectores();
    this.subscribeToGenAIState();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToGenAIState(): void {
    this.genaiService.analysisInProgress$
      .pipe(takeUntil(this.destroy$))
      .subscribe(inProgress => {
        this.genaiLoading = inProgress;
      });

    this.genaiService.lastAnalysisResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.genaiResult = result;
      });

    this.genaiService.selectedConnectors$
      .pipe(takeUntil(this.destroy$))
      .subscribe(connectors => {
        this.conectoresSeleccionados = connectors;
      });
  }

  loadCapaData(): void {
    this.loading = true;
    this.error = "";

    this.proyectoService.getCapaCuatro(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log("Capa Cuatro data:", response);
        this.capaData = response;
        this.loading = false;
        
        // Intentar cargar insights previos si existen
        this.loadGenAIInsights();
      },
      error: (error: any) => {
        console.error("Error loading Capa Cuatro:", error);
        this.error = "Error al cargar los datos de Capa 4";
        this.loading = false;
      },
    });
  }

  loadConectores(): void {
    this.genaiService.getConectores().subscribe({
      next: (conectores) => {
        this.conectoresDisponibles = conectores;
        // Pre-seleccionar conectores activos
        const activos = conectores
          .filter(c => c.estado === 'ACTIVO')
          .map(c => c.id);
        this.genaiService.setSelectedConnectors(activos);
      },
      error: (error) => {
        console.error('Error loading conectores:', error);
      }
    });
  }

  loadGenAIInsights(): void {
    this.genaiService.getGenAIInsights(this.proyectoId).subscribe({
      next: (result) => {
        console.log('GenAI insights loaded:', result);
      },
      error: (error) => {
        // Es normal que no existan insights previos
        console.log('No hay insights previos:', error.message);
      }
    });
  }

  // ========== Métodos GenAI ==========

  toggleConector(conectorId: string): void {
    this.genaiService.toggleConnector(conectorId);
  }

  isConectorSelected(conectorId: string): boolean {
    return this.conectoresSeleccionados.includes(conectorId);
  }

  ejecutarAnalisisGenAI(): void {
    if (this.conectoresSeleccionados.length === 0) {
      this.genaiError = 'Selecciona al menos un conector para el análisis';
      return;
    }

    this.genaiError = '';
    
    this.genaiService.analyzeWithGenAI(this.proyectoId, {
      conectoresSeleccionados: this.conectoresSeleccionados,
      incluirHistorial: true,
      nivelDetalle: this.nivelDetalle
    }).subscribe({
      next: (result) => {
        console.log('Análisis GenAI completado:', result);
        this.activeGenAITab = 'resumen';
      },
      error: (error) => {
        this.genaiError = error.message || 'Error al ejecutar análisis GenAI';
        console.error('Error en análisis GenAI:', error);
      }
    });
  }

  limpiarAnalisis(): void {
    this.genaiService.clearLastAnalysis();
    this.genaiError = '';
  }

  // ========== Getters para template ==========

  get riesgosOrdenados(): RiesgoPredicho[] {
    if (!this.genaiResult?.riesgosPredichos) return [];
    return [...this.genaiResult.riesgosPredichos].sort((a, b) => 
      b.probabilidad - a.probabilidad
    );
  }

  get riesgosCriticos(): RiesgoPredicho[] {
    return this.riesgosOrdenados.filter(r => 
      r.impacto === 'CRITICO' || r.impacto === 'ALTO'
    );
  }

  get recomendacionesOrdenadas(): Recomendacion[] {
    if (!this.genaiResult?.recomendaciones) return [];
    return [...this.genaiResult.recomendaciones].sort((a, b) => 
      a.prioridad - b.prioridad
    );
  }

  get alertasNoLeidas(): Alerta[] {
    if (!this.genaiResult?.alertas) return [];
    return this.genaiResult.alertas.filter(a => !a.leida);
  }

  get conectoresActivosCount(): number {
    return this.conectoresDisponibles.filter(c => c.estado === 'ACTIVO').length;
  }

  // ========== Métodos de visualización ==========

  getImpactColor(impacto: string): string {
    return this.genaiService.getImpactColor(impacto);
  }

  getStatusColor(status: string): string {
    return this.genaiService.getStatusColor(status);
  }

  getRecommendationIcon(tipo: string): string {
    return this.genaiService.getRecommendationIcon(tipo);
  }

  formatDate(dateString: string): string {
    return this.genaiService.formatDate(dateString);
  }

  getProbabilidadClass(probabilidad: number): string {
    if (probabilidad >= 80) return 'prob-critical';
    if (probabilidad >= 60) return 'prob-high';
    if (probabilidad >= 40) return 'prob-medium';
    return 'prob-low';
  }

  getTendenciaIcon(tendencia: string): string {
    const icons: any = {
      MEJORANDO: "fa-arrow-up",
      CRECIENTE: "fa-arrow-up",
      ESTABLE: "fa-minus",
      EMPEORANDO: "fa-arrow-down",
      DECRECIENTE: "fa-arrow-down",
      DETERIORANDO: "fa-arrow-down"
    };
    return icons[tendencia] || "fa-minus";
  }

  getTendenciaClass(tendencia: string): string {
    const classes: any = {
      MEJORANDO: 'tendencia-mejorando',
      CRECIENTE: 'tendencia-creciente',
      ESTABLE: 'tendencia-estable',
      EMPEORANDO: 'tendencia-empeorando',
      DECRECIENTE: 'tendencia-decreciente',
      DETERIORANDO: 'tendencia-deteriorando'
    };
    return classes[tendencia] || 'tendencia-estable';
  }

  getConectorIcon(conectorId: string): string {
    const icons: Record<string, string> = {
      'jira': 'fab fa-jira',
      'github': 'fab fa-github',
      'teams': 'fab fa-microsoft',
      'sharepoint': 'fas fa-cloud',
      'confluence': 'fab fa-confluence',
      'sonarqube': 'fas fa-code',
      'outlook': 'fas fa-envelope'
    };
    return icons[conectorId] || 'fas fa-plug';
  }

  // Métodos existentes para conectores
  getConectoresFiltrados(): any[] {
    if (!this.capaData?.conectores) return [];
    if (this.filtroConector === "TODOS") {
      return this.capaData.conectores;
    }
    return this.capaData.conectores.filter(
      (c: any) => c.estado === this.filtroConector
    );
  }

  getConectoresActivos(): number {
    if (!this.capaData?.conectores) return 0;
    return this.capaData.conectores.filter((c: any) => c.estado === "ACTIVO")
      .length;
  }

  getConectoresDisponibles(): number {
    if (!this.capaData?.conectores) return 0;
    return this.capaData.conectores.filter(
      (c: any) => c.estado === "DISPONIBLE"
    ).length;
  }

  getTotalDatosObtenidos(): number {
    if (!this.capaData?.conectores) return 0;
    const activos = this.capaData.conectores.filter(
      (c: any) => c.estado === "ACTIVO"
    );
    const datosSet = new Set<string>();
    activos.forEach((c: any) => {
      c.datosObtenidos?.forEach((d: string) => datosSet.add(d));
    });
    return datosSet.size;
  }
}
