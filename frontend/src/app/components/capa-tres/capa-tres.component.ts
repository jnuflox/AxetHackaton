import { Component, Input, OnInit } from '@angular/core';
import { ProyectoService } from '../../services/proyecto.service';

@Component({
  selector: 'app-capa-tres',
  templateUrl: './capa-tres.component.html',
  styleUrls: ['./capa-tres.component.scss']
})
export class CapaTresComponent implements OnInit {
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
    
    this.proyectoService.getCapaTres(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log('Capa Tres data:', response);
        this.capaData = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading Capa Tres:', error);
        this.error = 'Error al cargar los datos de Capa 3';
        this.loading = false;
      }
    });
  }
}
