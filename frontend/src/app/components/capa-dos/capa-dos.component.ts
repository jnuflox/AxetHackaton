import { Component, Input, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-capa-dos',
  templateUrl: './capa-dos.component.html',
  styleUrls: ['./capa-dos.component.scss']
})
export class CapaDosComponent implements OnInit {
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
    
    this.proyectoService.getCapaDos(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log('Capa Dos data:', response);
        this.capaData = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading Capa Dos:', error);
        this.error = 'Error al cargar los datos de Capa 2';
        this.loading = false;
      }
    });
  }

  getSemaforoClass(semaforo: string): string {
    return `semaforo-${semaforo?.toLowerCase()}`;
  }
}
