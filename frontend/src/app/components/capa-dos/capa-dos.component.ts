import { Component, Input, OnInit } from "@angular/core";
import { ProyectoService } from "../../services/proyecto.service";

@Component({
  selector: "app-capa-dos",
  templateUrl: "./capa-dos.component.html",
  styleUrls: ["./capa-dos.component.scss"],
})
export class CapaDosComponent implements OnInit {
  @Input() proyectoId!: string;
  capaData: any = null;
  loading = true;
  error = "";
  hitoSeleccionado: any = null;

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.loadCapaData();
  }

  loadCapaData(): void {
    this.loading = true;
    this.error = "";

    this.proyectoService.getCapaDos(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log("Capa Dos data:", response);
        this.capaData = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error loading Capa Dos:", error);
        this.error = "Error al cargar los datos de Capa 2";
        this.loading = false;
      },
    });
  }

  getSemaforoClass(semaforo: string): string {
    return `semaforo-${semaforo?.toLowerCase()}`;
  }

  getInitials(nombre: string): string {
    if (!nombre) return "?";
    return nombre
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  seleccionarHito(hito: any): void {
    if (this.hitoSeleccionado?.id === hito.id) {
      this.hitoSeleccionado = null;
    } else {
      this.hitoSeleccionado = hito;
    }
  }

  getEstadoTareaClass(estado: string): string {
    const clases: { [key: string]: string } = {
      COMPLETADA: "estado-completada",
      EN_PROGRESO: "estado-en-progreso",
      PENDIENTE: "estado-pendiente",
      RETRASADA: "estado-retrasada",
    };
    return clases[estado] || "estado-pendiente";
  }
}
