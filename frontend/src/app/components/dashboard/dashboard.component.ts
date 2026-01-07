import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProyectoService } from '../../services/proyecto.service';
import { Proyecto } from '../../models/proyecto.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  proyectos: Proyecto[] = [];
  loading: boolean = true;

  // Datos para gráficos de pie
  estadosChartData: any[] = [];
  estadosChartLabels: string[] = [];
  estadosChartColors: any[] = [{
    backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0']
  }];

  alertasChartData: any[] = [];
  alertasChartLabels: string[] = ['Sin Alertas', 'Con Alertas'];
  alertasChartColors: any[] = [{
    backgroundColor: ['#4CAF50', '#F44336']
  }];

  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  constructor(
    private proyectoService: ProyectoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProyectos();
  }

  loadProyectos(): void {
    this.proyectoService.getProyectos().subscribe({
      next: (data) => {
        this.proyectos = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.loading = false;
      }
    });
  }

  prepareChartData(): void {
    // Gráfico de estados
    const estadosCount: any = {};
    this.proyectos.forEach(p => {
      estadosCount[p.estado] = (estadosCount[p.estado] || 0) + 1;
    });

    this.estadosChartLabels = Object.keys(estadosCount);
    this.estadosChartData = [{
      data: Object.values(estadosCount)
    }];

    // Gráfico de alertas
    const conAlertas = this.proyectos.filter(p => p.alertas && p.alertas.length > 0).length;
    const sinAlertas = this.proyectos.length - conAlertas;
    this.alertasChartData = [{
      data: [sinAlertas, conAlertas]
    }];
  }

  getProyectosPorEstado(estado: string): number {
    return this.proyectos.filter(p => p.estado === estado).length;
  }

  getTotalAlertas(): number {
    return this.proyectos.reduce((sum, p) => sum + (p.alertas?.length || 0), 0);
  }

  getScorePromedio(): number {
    const proyectosConScore = this.proyectos.filter(p => p.scoreGlobal);
    if (proyectosConScore.length === 0) return 0;
    const sum = proyectosConScore.reduce((acc, p) => acc + (p.scoreGlobal || 0), 0);
    return Math.round(sum / proyectosConScore.length);
  }

  verProyecto(id: string): void {
    this.router.navigate(['/proyectos', id]);
  }

  verCapa(proyectoId: string, capa: number): void {
    this.router.navigate([`/capa-${this.numeroACadena(capa)}`, proyectoId]);
  }

  numeroACadena(num: number): string {
    const map: any = {1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro'};
    return map[num] || 'uno';
  }

  getBadgeClass(estado: string): string {
    const classes: any = {
      'PLANIFICACION': 'badge-info',
      'EN_EJECUCION': 'badge-primary',
      'EN_PAUSA': 'badge-warning',
      'CERRADO': 'badge-success',
      'CANCELADO': 'badge-error'
    };
    return classes[estado] || 'badge-secondary';
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  }
}
