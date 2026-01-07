import { Component, Input, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-capa-uno',
  templateUrl: './capa-uno.component.html',
  styleUrls: ['./capa-uno.component.scss']
})
export class CapaUnoComponent implements OnInit {
  @Input() proyectoId!: string;
  capaData: any = null;
  loading = true;
  error = '';

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.loadCapaData();
  }

  loadCapaData(): void {
    this.loading = true;
    this.error = '';
    
    this.proyectoService.getCapaUno(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log('Capa Uno data:', response);
        this.capaData = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading Capa Uno:', error);
        this.error = 'Error al cargar los datos de Capa 1';
        this.loading = false;
      }
    });
  }

  formatCurrency(value: number): string {
    if (!value) return '$0';
    return '$' + value.toLocaleString('es-US');
  }

  getRiskColor(nivel: string): string {
    const colors: any = {
      'BAJA': 'green',
      'MEDIA': 'yellow',
      'ALTA': 'orange',
      'CRÍTICO': 'red',
      'CRITICO': 'red'
    };
    return colors[nivel] || 'gray';
  }
}
