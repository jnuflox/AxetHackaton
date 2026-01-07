import { Component, Input, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-capa-cuatro',
  templateUrl: './capa-cuatro.component.html',
  styleUrls: ['./capa-cuatro.component.scss']
})
export class CapaCuatroComponent implements OnInit {
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
    
    this.proyectoService.getCapaCuatro(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log('Capa Cuatro data:', response);
        this.capaData = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading Capa Cuatro:', error);
        this.error = 'Error al cargar los datos de Capa 4';
        this.loading = false;
      }
    });
  }

  getTendenciaIcon(tendencia: string): string {
    const icons: any = {
      'MEJORANDO': 'fa-arrow-up',
      'ESTABLE': 'fa-minus',
      'EMPEORANDO': 'fa-arrow-down'
    };
    return icons[tendencia] || 'fa-minus';
  }

  getTendenciaClass(tendencia: string): string {
    return `tendencia-${tendencia?.toLowerCase()}`;
  }
}
