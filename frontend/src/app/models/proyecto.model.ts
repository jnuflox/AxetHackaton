export interface Proyecto {
  _id?: string;
  nombre: string;
  codigo: string;
  cliente: string;
  estado: EstadoProyecto;
  fechaInicio: Date;
  fechaFinPlanificada: Date;
  fechaFinReal?: Date;
  scoreGlobal?: number;
  alertas?: Alerta[];
  capaUno?: string;
  capaDos?: string;
  capaTres?: string;
  capaCuatro?: string;
}

export type EstadoProyecto =
  | "PLANIFICACION"
  | "EN_EJECUCION"
  | "EN_CIERRE"
  | "CERRADO"
  | "CANCELADO";

export interface Alerta {
  tipo: string;
  severidad: "BAJA" | "MEDIA" | "ALTA" | "CRITICA";
  mensaje: string;
  fecha: Date;
}

export interface CapaUno {
  _id?: string;
  proyecto: string;
  rfp?: {
    documentoUrl?: string;
    fechaEmision?: Date;
    slas?: SLA[];
  };
  propuestaTecnica?: {
    documentoUrl?: string;
    alcance?: string;
    tecnologias?: string[];
    metodologia?: string;
  };
  propuestaEconomica?: {
    documentoUrl?: string;
    presupuestoTotal?: number;
    moneda?: string;
  };
  gecoval?: {
    duracionMeses?: number;
    teamMembers?: number;
    presupuesto?: number;
    esfuerzoEstimadoHoras?: number;
  };
  l1?: {
    riesgosIniciales?: Riesgo[];
    ofertaCM?: number;
    pisoCM?: number;
    otrosCostos?: {
      cartasFianza?: number;
      garantias?: number;
      otros?: { concepto: string; monto: number }[];
    };
  };
  planFacturacion?: ItemFacturacion[];
}

export interface SLA {
  nombre: string;
  descripcion: string;
  metrica: string;
  valorCompromiso: string;
}

export interface ItemFacturacion {
  hito: string;
  fechaEstimada: Date;
  monto: number;
  porcentaje: number;
  estado: "PENDIENTE" | "FACTURADO" | "COBRADO";
}

export interface CapaDos {
  _id?: string;
  proyecto: string;
  cronograma?: {
    hitos?: Hito[];
    equipoAsignado?: TeamMember[];
    esfuerzoEstimado?: number;
    esfuerzoReal?: number;
  };
  jira?: {
    proyectoKey?: string;
    totalIssues?: number;
    issuesCompletados?: number;
    issuesEnProgreso?: number;
    issuesPendientes?: number;
    sprintActual?: string;
    velocidadPromedio?: number;
    ultimaActualizacion?: Date;
  };
  kpis?: {
    cumplimientoTareas?: number;
    avanceHitos?: number;
    cumplimientoSLAs?: CumplimientoSLA[];
  };
  riesgos?: Riesgo[];
  historial?: HistorialItem[];
}

export interface Hito {
  id?: string;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFinPlanificada: Date;
  fechaFinReal?: Date;
  responsable?: Responsable;
  estado:
    | "NO_INICIADO"
    | "EN_PROGRESO"
    | "COMPLETADO"
    | "RETRASADO"
    | "BLOQUEADO";
  semaforo: "VERDE" | "AMARILLO" | "ROJO";
  avancePorcentaje: number;
  tareas?: Tarea[];
}

export interface Tarea {
  id: string;
  nombre: string;
  responsable: {
    nombre: string;
    cargo: string;
  };
  fechaInicio: string;
  fechaFin: string;
  estado: "PENDIENTE" | "EN_PROGRESO" | "COMPLETADA" | "RETRASADA";
}

export interface Responsable {
  nombre: string;
  email: string;
  cargo: string;
  avatar?: string;
}

export interface TeamMember {
  nombre: string;
  rol: string;
  dedicacion: number;
  fechaInicio: Date;
  fechaFin?: Date;
}

export interface CumplimientoSLA {
  slaId: string;
  nombre: string;
  estado: "CUMPLIDO" | "EN_RIESGO" | "INCUMPLIDO";
  valorActual: string;
  valorCompromiso: string;
  semaforo: "VERDE" | "AMARILLO" | "ROJO";
}

export interface Riesgo {
  descripcion: string;
  categoria?: string;
  severidad: "BAJA" | "MEDIA" | "ALTA" | "CRITICA";
  probabilidad?: string;
  impacto?: string;
  planMitigacion?: string;
  estado?: "IDENTIFICADO" | "EN_MITIGACION" | "MITIGADO" | "MATERIALIZADO";
  fechaIdentificacion?: Date;
}

export interface HistorialItem {
  tipo:
    | "CHANGE_REQUEST"
    | "DECISION"
    | "CAMBIO_ESTRATEGIA"
    | "HITO"
    | "INCIDENCIA";
  titulo: string;
  descripcion: string;
  fecha: Date;
  impacto?: string;
  responsable?: string;
}

export interface CapaTres {
  _id?: string;
  proyecto: string;
  repositorio?: {
    tipo?: "GITHUB" | "SHAREPOINT" | "CONFLUENCE";
    url?: string;
    rama?: string;
    ultimoCommit?: any;
  };
  sonarqube?: {
    projectKey?: string;
    serverUrl?: string;
    ultimoAnalisis?: Date;
    metricas?: MetricasSonar;
    deudaTecnica?: DeudaTecnica;
  };
  coverage?: {
    unitario?: Coverage;
    integracion?: Coverage;
    e2e?: any;
  };
  vulnerabilidades?: Vulnerabilidad[];
  antipatrones?: Antipatron[];
  cumplimientoEstandares?: any;
  funcionalidades?: Funcionalidades;
}

export interface MetricasSonar {
  bugs?: number;
  vulnerabilities?: number;
  codeSmells?: number;
  coverage?: number;
  duplicatedLinesDensity?: number;
  technicalDebt?: number;
  reliabilityRating?: string;
  securityRating?: string;
  maintainabilityRating?: string;
}

export interface DeudaTecnica {
  total?: number;
  critica?: number;
  alta?: number;
  media?: number;
  baja?: number;
  tendencia?: "MEJORANDO" | "ESTABLE" | "EMPEORANDO";
}

export interface Coverage {
  lineCoverage?: number;
  branchCoverage?: number;
  totalLineas?: number;
  lineasCubiertas?: number;
}

export interface Vulnerabilidad {
  tipo: string;
  severidad: "CRITICA" | "ALTA" | "MEDIA" | "BAJA";
  descripcion: string;
  archivo: string;
  linea: number;
  recomendacion: string;
  estado: "ABIERTA" | "EN_REVISION" | "RESUELTA" | "ACEPTADA";
}

export interface Antipatron {
  nombre: string;
  descripcion: string;
  ubicacion: string;
  impacto: string;
  sugerencia: string;
}

export interface Funcionalidades {
  comprometidas?: number;
  implementadas?: number;
  enDesarrollo?: number;
  pendientes?: number;
  detalle?: any[];
}

export interface CapaCuatro {
  _id?: string;
  proyecto: string;
  scoreGlobal?: {
    valor?: number;
    ultimaActualizacion?: Date;
    tendencia?: "MEJORANDO" | "ESTABLE" | "EMPEORANDO";
  };
  sensibilidadTecnica?: SensibilidadTecnica;
  sensibilidadEconomica?: SensibilidadEconomica;
  escenariosWhatIf?: EscenarioWhatIf[];
  recomendaciones?: Recomendacion[];
}

export interface SensibilidadTecnica {
  probabilidadCumplimientoPlazos?: number;
  prediccionEntregaHitos?: any[];
  riesgoIncumplimientoSLAs?: any[];
  alertasTempranas?: AlertaTemprana[];
}

export interface AlertaTemprana {
  tipo: string;
  severidad: "BAJA" | "MEDIA" | "ALTA" | "CRITICA";
  descripcion: string;
  metricas?: any[];
  accionesRecomendadas?: string[];
  fecha: Date;
}

export interface SensibilidadEconomica {
  proyeccionCM?: {
    actual?: number;
    proyectado?: number;
    tendencia?: string;
    confianza?: number;
  };
  forecastBudget?: {
    presupuestoInicial?: number;
    gastadoAcumulado?: number;
    proyeccionFinal?: number;
    desviacion?: number;
    desviacionPorcentaje?: number;
  };
  funding?: any;
  workInProgress?: any;
  riesgoWriteOff?: {
    probabilidad?: number;
    montoEnRiesgo?: number;
    factores?: string[];
  };
  proyeccionRentabilidad?: any;
}

export interface EscenarioWhatIf {
  nombre: string;
  descripcion: string;
  variables?: any[];
  impactos?: any;
  probabilidad?: number;
  recomendacion?: string;
  fechaCreacion?: Date;
}

export interface Recomendacion {
  tipo: "ACCION_CORRECTIVA" | "OPTIMIZACION" | "PREVENTIVA" | "ESTRATEGICA";
  prioridad: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
  titulo: string;
  descripcion: string;
  impactoEstimado?: string;
  esfuerzoRequerido?: string;
  beneficioEsperado?: string;
  estado: "PENDIENTE" | "EN_IMPLEMENTACION" | "IMPLEMENTADA" | "RECHAZADA";
  fechaGeneracion?: Date;
}
