import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProyectoService } from '../../services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-proyecto-list',
  template: `
    <div class="proyecto-list-container">
      <div class="header">
        <h1>Proyectos</h1>
        <button class="btn btn-primary" (click)="showCreateForm = true">
          + Nuevo Proyecto
        </button>
      </div>

      <div class="filters card" *ngIf="!showCreateForm">
        <input 
          type="text" 
          placeholder="Buscar por nombre, código o cliente..." 
          [(ngModel)]="searchTerm"
          (input)="filterProyectos()"
          class="search-input">
        
        <select [(ngModel)]="filtroEstado" (change)="filterProyectos()" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="PLANIFICACION">Planificación</option>
          <option value="EN_EJECUCION">En Ejecución</option>
          <option value="EN_CIERRE">En Cierre</option>
          <option value="CERRADO">Cerrado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      <div class="create-form card" *ngIf="showCreateForm">
        <h2>Crear Nuevo Proyecto</h2>
        <form (ngSubmit)="createProyecto()">
          <div class="form-group">
            <label>Nombre del Proyecto *</label>
            <input type="text" [(ngModel)]="nuevoProyecto.nombre" name="nombre" required>
          </div>
          <div class="form-group">
            <label>Código *</label>
            <input type="text" [(ngModel)]="nuevoProyecto.codigo" name="codigo" required>
          </div>
          <div class="form-group">
            <label>Cliente *</label>
            <input type="text" [(ngModel)]="nuevoProyecto.cliente" name="cliente" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Fecha Inicio *</label>
              <input type="date" [(ngModel)]="nuevoProyecto.fechaInicio" name="fechaInicio" required>
            </div>
            <div class="form-group">
              <label>Fecha Fin Planificada *</label>
              <input type="date" [(ngModel)]="nuevoProyecto.fechaFinPlanificada" name="fechaFinPlanificada" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn" (click)="cancelCreate()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Crear Proyecto</button>
          </div>
        </form>
      </div>

      <div class="proyectos-table" *ngIf="!showCreateForm">
        <table class="card" *ngIf="proyectosFiltrados.length > 0">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Inicio</th>
              <th>Fin Planificada</th>
              <th>Score</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let proyecto of proyectosFiltrados">
              <td><strong>{{ proyecto.codigo }}</strong></td>
              <td>{{ proyecto.nombre }}</td>
              <td>{{ proyecto.cliente }}</td>
              <td>
                <span class="badge" [ngClass]="getBadgeClass(proyecto.estado)">
                  {{ proyecto.estado }}
                </span>
              </td>
              <td>{{ proyecto.fechaInicio | date:'dd/MM/yyyy' }}</td>
              <td>{{ proyecto.fechaFinPlanificada | date:'dd/MM/yyyy' }}</td>
              <td>
                <span *ngIf="proyecto.scoreGlobal" [ngClass]="getScoreClass(proyecto.scoreGlobal)">
                  {{ proyecto.scoreGlobal }}
                </span>
                <span *ngIf="!proyecto.scoreGlobal">-</span>
              </td>
              <td>
                <button class="btn-icon" (click)="verProyecto(proyecto._id!)" title="Ver detalles">
                  👁️
                </button>
                <button class="btn-icon" (click)="eliminarProyecto(proyecto._id!)" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="proyectosFiltrados.length === 0 && !loading">
          <p>No se encontraron proyectos</p>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Cargando proyectos...</p>
      </div>
    </div>
  `,
  styles: [`
    .proyecto-list-container {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
    }

    .search-input {
      flex: 1;
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
      min-width: 200px;
    }

    .create-form {
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.875rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: var(--bg-secondary);
    }

    th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid var(--bg-secondary);
    }

    tbody tr:hover {
      background-color: var(--bg-secondary);
    }

    .btn-icon {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      transition: transform 0.2s;
    }

    .btn-icon:hover {
      transform: scale(1.2);
    }

    .score-alta { color: var(--success-color); font-weight: bold; }
    .score-media { color: var(--warning-color); font-weight: bold; }
    .score-baja { color: var(--error-color); font-weight: bold; }

    .badge-EN_EJECUCION { background-color: #bbdefb; color: #1565c0; }
    .badge-PLANIFICACION { background-color: #fff9c4; color: #f57f17; }
    .badge-EN_CIERRE { background-color: #ffccbc; color: #d84315; }
    .badge-CERRADO { background-color: #c8e6c9; color: #2e7d32; }
    .badge-CANCELADO { background-color: #ffcdd2; color: #c62828; }

    .loading {
      text-align: center;
      padding: 4rem 0;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }

      table {
        font-size: 0.75rem;
      }

      th, td {
        padding: 0.5rem;
      }
    }
  `]
})
export class ProyectoListComponent implements OnInit {
  proyectos: Proyecto[] = [];
  proyectosFiltrados: Proyecto[] = [];
  loading = true;
  showCreateForm = false;
  searchTerm = '';
  filtroEstado = '';

  nuevoProyecto: any = {
    nombre: '',
    codigo: '',
    cliente: '',
    estado: 'PLANIFICACION',
    fechaInicio: '',
    fechaFinPlanificada: ''
  };

  constructor(
    private proyectoService: ProyectoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProyectos();
  }

  loadProyectos(): void {
    this.loading = true;
    this.proyectoService.getProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.proyectosFiltrados = proyectos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando proyectos:', error);
        this.loading = false;
      }
    });
  }

  filterProyectos(): void {
    this.proyectosFiltrados = this.proyectos.filter(proyecto => {
      const matchSearch = !this.searchTerm || 
        proyecto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        proyecto.codigo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        proyecto.cliente.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchEstado = !this.filtroEstado || proyecto.estado === this.filtroEstado;
      
      return matchSearch && matchEstado;
    });
  }

  createProyecto(): void {
    this.proyectoService.createProyecto(this.nuevoProyecto).subscribe({
      next: (proyecto) => {
        this.showCreateForm = false;
        this.loadProyectos();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creando proyecto:', error);
        alert('Error al crear el proyecto');
      }
    });
  }

  cancelCreate(): void {
    this.showCreateForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.nuevoProyecto = {
      nombre: '',
      codigo: '',
      cliente: '',
      estado: 'PLANIFICACION',
      fechaInicio: '',
      fechaFinPlanificada: ''
    };
  }

  verProyecto(id: string): void {
    this.router.navigate(['/proyectos', id]);
  }

  eliminarProyecto(id: string): void {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      this.proyectoService.deleteProyecto(id).subscribe({
        next: () => {
          this.loadProyectos();
        },
        error: (error) => {
          console.error('Error eliminando proyecto:', error);
          alert('Error al eliminar el proyecto');
        }
      });
    }
  }

  getBadgeClass(estado: string): string {
    return `badge-${estado}`;
  }

  getScoreClass(score: number): string {
    if (score >= 70) return 'score-alta';
    if (score >= 40) return 'score-media';
    return 'score-baja';
  }
}
