import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectoService } from '../../services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-proyecto-detail',
  template: `
    <div class="proyecto-detail-container" *ngIf="proyecto">
      <div class="header">
        <div>
          <h1>{{ proyecto.nombre }}</h1>
          <p class="subtitle">{{ proyecto.codigo }} - {{ proyecto.cliente }}</p>
        </div>
        <span class="badge" [ngClass]="getBadgeClass(proyecto.estado)">
          {{ proyecto.estado }}
        </span>
      </div>

      <div class="dashboard-summary card" *ngIf="dashboard">
        <h2>Resumen Ejecutivo</h2>
        <div class="grid grid-4">
          <div class="metric">
            <h3>Score Global</h3>
            <div class="metric-value" [ngClass]="getScoreClass(dashboard.proyecto?.scoreGlobal)">
              {{ dashboard.proyecto?.scoreGlobal || '-' }}
            </div>
          </div>
          <div class="metric">
            <h3>Avance Hitos</h3>
            <div class="metric-value">{{ dashboard.capaDos?.avanceHitos || '-' }}%</div>
          </div>
          <div class="metric">
            <h3>Coverage</h3>
            <div class="metric-value">{{ dashboard.capaTres?.coverage || '-' }}%</div>
          </div>
          <div class="metric">
            <h3>Probabilidad Cumplimiento</h3>
            <div class="metric-value">{{ dashboard.capaCuatro?.probabilidadCumplimientoPlazos || '-' }}%</div>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'capa1'" 
          (click)="activeTab = 'capa1'">
          Capa 1: Contractual
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'capa2'" 
          (click)="activeTab = 'capa2'">
          Capa 2: Operativa
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'capa3'" 
          (click)="activeTab = 'capa3'">
          Capa 3: Técnica
        </button>
        <button 
          class="tab-button" 
          [class.active]="activeTab === 'capa4'" 
          (click)="activeTab = 'capa4'">
          Capa 4: Predictiva
        </button>
      </div>

      <div class="tab-content">
        <app-capa-uno *ngIf="activeTab === 'capa1'" [proyectoId]="proyectoId"></app-capa-uno>
        <app-capa-dos *ngIf="activeTab === 'capa2'" [proyectoId]="proyectoId"></app-capa-dos>
        <app-capa-tres *ngIf="activeTab === 'capa3'" [proyectoId]="proyectoId"></app-capa-tres>
        <app-capa-cuatro *ngIf="activeTab === 'capa4'" [proyectoId]="proyectoId"></app-capa-cuatro>
      </div>
    </div>

    <div class="loading" *ngIf="loading">
      <div class="spinner"></div>
      <p>Cargando proyecto...</p>
    </div>
  `,
  styles: [`
    .proyecto-detail-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .dashboard-summary {
      margin-bottom: 2rem;
    }

    .metric {
      text-align: center;
    }

    .metric h3 {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: var(--primary-color);
    }

    .score-alta { color: var(--success-color); }
    .score-media { color: var(--warning-color); }
    .score-baja { color: var(--error-color); }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--bg-secondary);
    }

    .tab-button {
      padding: 1rem 1.5rem;
      border: none;
      background: none;
      cursor: pointer;
      font-weight: 500;
      color: var(--text-secondary);
      border-bottom: 3px solid transparent;
      transition: all 0.3s;
    }

    .tab-button:hover {
      color: var(--primary-color);
    }

    .tab-button.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .tab-content {
      min-height: 400px;
    }

    .badge-EN_EJECUCION { background-color: #bbdefb; color: #1565c0; }
    .badge-PLANIFICACION { background-color: #fff9c4; color: #f57f17; }
    .badge-EN_CIERRE { background-color: #ffccbc; color: #d84315; }
    .badge-CERRADO { background-color: #c8e6c9; color: #2e7d32; }
    .badge-CANCELADO { background-color: #ffcdd2; color: #c62828; }

    .loading {
      text-align: center;
      padding: 4rem 0;
    }

    @media (max-width: 768px) {
      .tabs {
        overflow-x: auto;
      }

      .tab-button {
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class ProyectoDetailComponent implements OnInit {
  proyectoId!: string;
  proyecto?: Proyecto;
  dashboard?: any;
  activeTab = 'capa1';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private proyectoService: ProyectoService
  ) {}

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('id')!;
    this.loadProyecto();
    this.loadDashboard();
  }

  loadProyecto(): void {
    this.proyectoService.getProyecto(this.proyectoId).subscribe({
      next: (proyecto) => {
        this.proyecto = proyecto;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando proyecto:', error);
        this.loading = false;
      }
    });
  }

  loadDashboard(): void {
    this.proyectoService.getDashboard(this.proyectoId).subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
      },
      error: (error) => {
        console.error('Error cargando dashboard:', error);
      }
    });
  }

  getBadgeClass(estado: string): string {
    return `badge-${estado}`;
  }

  getScoreClass(score: number): string {
    if (!score) return '';
    if (score >= 70) return 'score-alta';
    if (score >= 40) return 'score-media';
    return 'score-baja';
  }
}
