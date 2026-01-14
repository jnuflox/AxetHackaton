import { Component, Input, OnInit } from "@angular/core";
import { ProyectoService } from "../../services/proyecto.service";

@Component({
  selector: "app-capa-cuatro",
  templateUrl: "./capa-cuatro.component.html",
  styleUrls: ["./capa-cuatro.component.scss"],
})
export class CapaCuatroComponent implements OnInit {
  @Input() proyectoId!: string;
  capaData: any = null;
  loading = true;
  error = "";
  filtroConector: string = "TODOS";

  constructor(private proyectoService: ProyectoService) {}

  ngOnInit(): void {
    this.loadCapaData();
  }

  loadCapaData(): void {
    this.loading = true;
    this.error = "";

    this.proyectoService.getCapaCuatro(this.proyectoId).subscribe({
      next: (response: any) => {
        console.log("Capa Cuatro data:", response);
        this.capaData = response;
        this.loading = false;
      },
      error: (error: any) => {
        console.error("Error loading Capa Cuatro:", error);
        this.error = "Error al cargar los datos de Capa 4";
        this.loading = false;
      },
    });
  }

  getTendenciaIcon(tendencia: string): string {
    const icons: any = {
      MEJORANDO: "fa-arrow-up",
      ESTABLE: "fa-minus",
      EMPEORANDO: "fa-arrow-down",
    };
    return icons[tendencia] || "fa-minus";
  }

  getTendenciaClass(tendencia: string): string {
    return `tendencia-${tendencia?.toLowerCase()}`;
  }

  // Métodos para conectores
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
