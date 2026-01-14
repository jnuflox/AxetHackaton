// Datos de prueba para demostración del sistema
const mockProyectos = [
  {
    _id: "1",
    nombre: "Sistema de Gestión Bancaria",
    codigo: "PROJ-2025-001",
    cliente: "Banco Nacional",
    estado: "CERRADO",
    fechaInicio: new Date("2024-01-15"),
    fechaFinPlanificada: new Date("2024-12-15"),
    fechaFinReal: new Date("2024-12-10"),
    scoreGlobal: 95,
    alertas: [],
    descripcion:
      "Proyecto completado exitosamente 5 días antes de lo planificado",
    presupuesto: 500000,
    horasEstimadas: 5000,
    horasReales: 4850,
  },
  {
    _id: "2",
    nombre: "Plataforma E-Commerce",
    codigo: "PROJ-2025-002",
    cliente: "RetailCorp S.A.",
    estado: "EN_EJECUCION",
    fechaInicio: new Date("2024-06-01"),
    fechaFinPlanificada: new Date("2025-03-31"),
    scoreGlobal: 72,
    alertas: [
      {
        tipo: "RETRASO_SPRINT",
        severidad: "ALTA",
        mensaje:
          "El Sprint 8 tiene 3 días de retraso. Riesgo de impacto en milestone M3.",
        fecha: new Date("2025-01-05"),
      },
      {
        tipo: "COBERTURA_BAJA",
        severidad: "MEDIA",
        mensaje: "La cobertura de código bajó a 68%. Objetivo: 80%.",
        fecha: new Date("2025-01-04"),
      },
    ],
    descripcion: "Proyecto en ejecución con alertas de retraso y calidad",
    presupuesto: 350000,
    horasEstimadas: 3500,
    horasReales: 2100,
  },
  {
    _id: "3",
    nombre: "Migración a Cloud AWS",
    codigo: "PROJ-2025-003",
    cliente: "TechSolutions Inc.",
    estado: "EN_EJECUCION",
    fechaInicio: new Date("2024-09-01"),
    fechaFinPlanificada: new Date("2025-06-30"),
    scoreGlobal: 68,
    alertas: [
      {
        tipo: "VULNERABILIDAD_CRITICA",
        severidad: "CRITICA",
        mensaje:
          "2 vulnerabilidades críticas detectadas en dependencias. Requiere acción inmediata.",
        fecha: new Date("2025-01-06"),
      },
      {
        tipo: "PRESUPUESTO",
        severidad: "ALTA",
        mensaje: "Proyección de sobrecosto del 15%. CM% en riesgo.",
        fecha: new Date("2025-01-03"),
      },
      {
        tipo: "RECURSO",
        severidad: "MEDIA",
        mensaje:
          "Arquitecto cloud con 2 semanas de ausencia programada en febrero.",
        fecha: new Date("2025-01-02"),
      },
    ],
    descripcion:
      "Proyecto con múltiples alertas críticas que requieren atención",
    presupuesto: 800000,
    horasEstimadas: 8000,
    horasReales: 4200,
  },
  {
    _id: "4",
    nombre: "App Móvil HealthCare",
    codigo: "PROJ-2024-015",
    cliente: "MediPlus Clinic",
    estado: "CERRADO",
    fechaInicio: new Date("2024-03-01"),
    fechaFinPlanificada: new Date("2024-11-30"),
    fechaFinReal: new Date("2024-11-28"),
    scoreGlobal: 88,
    alertas: [],
    descripcion:
      "Aplicación móvil entregada exitosamente con alta satisfacción del cliente",
    presupuesto: 250000,
    horasEstimadas: 2500,
    horasReales: 2480,
  },
  {
    _id: "5",
    nombre: "Portal de Administración Interna",
    codigo: "PROJ-2025-004",
    cliente: "LogisticPro",
    estado: "EN_EJECUCION",
    fechaInicio: new Date("2024-10-01"),
    fechaFinPlanificada: new Date("2025-02-28"),
    scoreGlobal: 55,
    alertas: [
      {
        tipo: "RETRASO_CRITICO",
        severidad: "CRITICA",
        mensaje:
          "Proyecto con 4 semanas de retraso acumulado. Alto riesgo de incumplimiento de fecha.",
        fecha: new Date("2025-01-06"),
      },
      {
        tipo: "CALIDAD",
        severidad: "ALTA",
        mensaje: "Deuda técnica crítica: 45 días. SonarQube Rating: D",
        fecha: new Date("2025-01-05"),
      },
      {
        tipo: "EQUIPO",
        severidad: "ALTA",
        mensaje:
          "Rotación de personal: 3 desarrolladores renunciaron en el último mes.",
        fecha: new Date("2025-01-04"),
      },
      {
        tipo: "SCOPE_CREEP",
        severidad: "MEDIA",
        mensaje:
          "8 change requests no aprobados formalmente están en desarrollo.",
        fecha: new Date("2025-01-03"),
      },
    ],
    descripcion:
      "Proyecto en estado crítico con retraso significativo y múltiples problemas",
    presupuesto: 180000,
    horasEstimadas: 1800,
    horasReales: 1950,
  },
];

// Datos detallados para cada capa
const mockCapasData = {
  1: {
    capaUno: {
      rfp: {
        fechaEmision: new Date("2023-11-01"),
        slas: [
          {
            nombre: "Disponibilidad",
            metrica: "Uptime",
            valorCompromiso: "99.9%",
          },
          {
            nombre: "Tiempo de Respuesta",
            metrica: "Response Time",
            valorCompromiso: "< 2s",
          },
        ],
      },
      gecoval: {
        esfuerzoEstimadoHoras: 5000,
        tarifa: 100,
      },
      l1: {
        fechaAprobacion: new Date("2023-12-15"),
        riesgosIniciales: [],
      },
    },
    capaDos: {
      cronograma: {
        fechaInicio: new Date("2024-01-15"),
        fechaFinPlanificada: new Date("2024-12-15"),
        hitos: [
          {
            nombre: "Análisis",
            fechaPlanificada: new Date("2024-02-28"),
            fechaReal: new Date("2024-02-25"),
            semaforo: "VERDE",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "María García López",
              email: "maria.garcia@nttdata.com",
              cargo: "Analista de Negocio Senior",
            },
          },
          {
            nombre: "Desarrollo",
            fechaPlanificada: new Date("2024-08-31"),
            fechaReal: new Date("2024-08-28"),
            semaforo: "VERDE",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Carlos Rodríguez Martín",
              email: "carlos.rodriguez@nttdata.com",
              cargo: "Tech Lead",
            },
          },
          {
            nombre: "Despliegue",
            fechaPlanificada: new Date("2024-12-15"),
            fechaReal: new Date("2024-12-10"),
            semaforo: "VERDE",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Ana Martínez Sánchez",
              email: "ana.martinez@nttdata.com",
              cargo: "DevOps Engineer",
            },
          },
        ],
      },
      kpis: [
        {
          nombre: "Velocity",
          valorActual: 45,
          valorObjetivo: 40,
          unidad: "story points",
        },
        {
          nombre: "Burndown",
          valorActual: 100,
          valorObjetivo: 100,
          unidad: "%",
        },
      ],
      riesgos: [],
    },
    capaTres: {
      repositorio: {
        url: "https://github.com/bancnacional/gestion",
        rama: "main",
      },
      sonarqube: {
        cobertura: 85,
        deudaTecnica: 5,
        vulnerabilidades: 0,
        rating: "A",
      },
    },
    capaCuatro: {
      scoreGlobal: {
        valor: 95,
        tendencia: "ESTABLE",
        ultimaActualizacion: new Date("2024-12-10"),
      },
    },
  },
  2: {
    capaUno: {
      rfp: {
        fechaEmision: new Date("2024-04-15"),
        slas: [
          {
            nombre: "Performance",
            metrica: "Load Time",
            valorCompromiso: "< 3s",
          },
          {
            nombre: "Disponibilidad",
            metrica: "Uptime",
            valorCompromiso: "99.5%",
          },
        ],
      },
      gecoval: {
        esfuerzoEstimadoHoras: 3500,
        tarifa: 95,
      },
      l1: {
        fechaAprobacion: new Date("2024-05-20"),
        riesgosIniciales: [
          {
            descripcion: "Integración con sistemas legacy",
            severidad: "MEDIA",
            probabilidad: "Alta",
            impacto: "Medio",
            planMitigacion: "Crear adaptadores y realizar POCs tempranos",
          },
        ],
      },
    },
    capaDos: {
      cronograma: {
        fechaInicio: new Date("2024-06-01"),
        fechaFinPlanificada: new Date("2025-03-31"),
        hitos: [
          {
            nombre: "MVP",
            fechaPlanificada: new Date("2024-10-31"),
            fechaReal: new Date("2024-11-03"),
            semaforo: "AMARILLO",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Pedro Fernández Ruiz",
              email: "pedro.fernandez@nttdata.com",
              cargo: "Product Owner",
            },
          },
          {
            nombre: "Fase 2",
            fechaPlanificada: new Date("2025-01-31"),
            fechaReal: null,
            semaforo: "AMARILLO",
            estado: "EN_PROGRESO",
            avancePorcentaje: 65,
            responsable: {
              nombre: "Laura Gómez Torres",
              email: "laura.gomez@nttdata.com",
              cargo: "Scrum Master",
            },
          },
          {
            nombre: "Go-Live",
            fechaPlanificada: new Date("2025-03-31"),
            fechaReal: null,
            semaforo: "ROJO",
            estado: "NO_INICIADO",
            avancePorcentaje: 0,
            responsable: {
              nombre: "Roberto Díaz Moreno",
              email: "roberto.diaz@nttdata.com",
              cargo: "Release Manager",
            },
          },
        ],
      },
      kpis: [
        {
          nombre: "Velocity",
          valorActual: 32,
          valorObjetivo: 38,
          unidad: "story points",
        },
        {
          nombre: "Sprint Completion",
          valorActual: 78,
          valorObjetivo: 85,
          unidad: "%",
        },
      ],
      riesgos: [
        {
          descripcion: "Retraso en Sprint 8",
          severidad: "ALTA",
          estado: "EN_MITIGACION",
        },
        {
          descripcion: "Dependencia externa no resuelta",
          severidad: "MEDIA",
          estado: "IDENTIFICADO",
        },
      ],
    },
    capaTres: {
      repositorio: {
        url: "https://github.com/retailcorp/ecommerce",
        rama: "develop",
      },
      sonarqube: {
        cobertura: 68,
        deudaTecnica: 18,
        vulnerabilidades: 3,
        rating: "C",
      },
    },
    capaCuatro: {
      scoreGlobal: {
        valor: 72,
        tendencia: "BAJANDO",
        ultimaActualizacion: new Date("2025-01-06"),
      },
    },
  },
  3: {
    capaUno: {
      rfp: {
        fechaEmision: new Date("2024-07-01"),
        slas: [
          {
            nombre: "Disponibilidad Cloud",
            metrica: "Uptime",
            valorCompromiso: "99.99%",
          },
          { nombre: "RTO", metrica: "Recovery Time", valorCompromiso: "< 4h" },
        ],
      },
      gecoval: {
        esfuerzoEstimadoHoras: 8000,
        tarifa: 110,
      },
      l1: {
        fechaAprobacion: new Date("2024-08-15"),
        riesgosIniciales: [
          {
            descripcion: "Complejidad de migración de datos",
            severidad: "ALTA",
            probabilidad: "Alta",
            impacto: "Alto",
            planMitigacion: "Plan de migración por fases con rollback",
          },
          {
            descripcion: "Costos de AWS mayores a estimado",
            severidad: "MEDIA",
            probabilidad: "Media",
            impacto: "Alto",
            planMitigacion: "Monitoreo continuo y optimización",
          },
        ],
      },
    },
    capaDos: {
      cronograma: {
        fechaInicio: new Date("2024-09-01"),
        fechaFinPlanificada: new Date("2025-06-30"),
        hitos: [
          {
            nombre: "Infraestructura Base",
            fechaPlanificada: new Date("2024-11-30"),
            fechaReal: new Date("2024-12-05"),
            semaforo: "AMARILLO",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Javier Herrera Cloud",
              email: "javier.herrera@nttdata.com",
              cargo: "Cloud Architect",
            },
          },
          {
            nombre: "Migración Fase 1",
            fechaPlanificada: new Date("2025-02-28"),
            fechaReal: null,
            semaforo: "ROJO",
            estado: "EN_PROGRESO",
            avancePorcentaje: 40,
            responsable: {
              nombre: "Elena Soto Navarro",
              email: "elena.soto@nttdata.com",
              cargo: "Migration Lead",
            },
          },
          {
            nombre: "Migración Completa",
            fechaPlanificada: new Date("2025-06-30"),
            fechaReal: null,
            semaforo: "ROJO",
            estado: "NO_INICIADO",
            avancePorcentaje: 0,
            responsable: {
              nombre: "Javier Herrera Cloud",
              email: "javier.herrera@nttdata.com",
              cargo: "Cloud Architect",
            },
          },
        ],
      },
      kpis: [
        {
          nombre: "Servicios Migrados",
          valorActual: 12,
          valorObjetivo: 25,
          unidad: "servicios",
        },
        {
          nombre: "Costo vs Budget",
          valorActual: 115,
          valorObjetivo: 100,
          unidad: "%",
        },
      ],
      riesgos: [
        {
          descripcion: "Vulnerabilidades críticas en dependencias",
          severidad: "CRITICA",
          estado: "IDENTIFICADO",
        },
        {
          descripcion: "Sobrecosto proyectado 15%",
          severidad: "ALTA",
          estado: "EN_MITIGACION",
        },
        {
          descripcion: "Ausencia de arquitecto cloud",
          severidad: "MEDIA",
          estado: "IDENTIFICADO",
        },
      ],
    },
    capaTres: {
      repositorio: {
        url: "https://github.com/techsolutions/cloud-migration",
        rama: "main",
      },
      sonarqube: {
        cobertura: 55,
        deudaTecnica: 35,
        vulnerabilidades: 12,
        rating: "D",
      },
    },
    capaCuatro: {
      scoreGlobal: {
        valor: 68,
        tendencia: "BAJANDO",
        ultimaActualizacion: new Date("2025-01-06"),
      },
    },
  },
  4: {
    capaUno: {
      rfp: {
        fechaEmision: new Date("2024-01-15"),
        slas: [
          {
            nombre: "Performance Móvil",
            metrica: "App Start Time",
            valorCompromiso: "< 2s",
          },
          {
            nombre: "Disponibilidad API",
            metrica: "Uptime",
            valorCompromiso: "99.8%",
          },
        ],
      },
      gecoval: {
        esfuerzoEstimadoHoras: 2500,
        tarifa: 90,
      },
      l1: {
        fechaAprobacion: new Date("2024-02-20"),
        riesgosIniciales: [],
      },
    },
    capaDos: {
      cronograma: {
        fechaInicio: new Date("2024-03-01"),
        fechaFinPlanificada: new Date("2024-11-30"),
        hitos: [
          {
            nombre: "Diseño UX/UI",
            fechaPlanificada: new Date("2024-04-30"),
            fechaReal: new Date("2024-04-28"),
            semaforo: "VERDE",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Sofía Mendoza Ríos",
              email: "sofia.mendoza@nttdata.com",
              cargo: "UX/UI Designer Lead",
            },
          },
          {
            nombre: "Desarrollo",
            fechaPlanificada: new Date("2024-09-30"),
            fechaReal: new Date("2024-09-25"),
            semaforo: "VERDE",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Miguel Ángel Castro",
              email: "miguel.castro@nttdata.com",
              cargo: "Mobile Developer Lead",
            },
          },
          {
            nombre: "Testing y Deploy",
            fechaPlanificada: new Date("2024-11-30"),
            fechaReal: new Date("2024-11-28"),
            semaforo: "VERDE",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Patricia Vega Luna",
              email: "patricia.vega@nttdata.com",
              cargo: "QA Manager",
            },
          },
        ],
      },
      kpis: [
        {
          nombre: "Velocity",
          valorActual: 38,
          valorObjetivo: 35,
          unidad: "story points",
        },
        {
          nombre: "Sprint Completion",
          valorActual: 92,
          valorObjetivo: 85,
          unidad: "%",
        },
      ],
      riesgos: [],
    },
    capaTres: {
      repositorio: {
        url: "https://github.com/mediplus/healthcare-app",
        rama: "main",
      },
      sonarqube: {
        cobertura: 82,
        deudaTecnica: 8,
        vulnerabilidades: 1,
        rating: "A",
      },
    },
    capaCuatro: {
      scoreGlobal: {
        valor: 88,
        tendencia: "ESTABLE",
        ultimaActualizacion: new Date("2024-11-28"),
      },
    },
  },
  5: {
    capaUno: {
      rfp: {
        fechaEmision: new Date("2024-08-15"),
        slas: [
          {
            nombre: "Disponibilidad",
            metrica: "Uptime",
            valorCompromiso: "99.5%",
          },
          {
            nombre: "Performance",
            metrica: "Response Time",
            valorCompromiso: "< 3s",
          },
        ],
      },
      gecoval: {
        esfuerzoEstimadoHoras: 1800,
        tarifa: 85,
      },
      l1: {
        fechaAprobacion: new Date("2024-09-20"),
        riesgosIniciales: [
          {
            descripcion: "Equipo junior sin experiencia en tecnología",
            severidad: "ALTA",
            probabilidad: "Alta",
            impacto: "Alto",
            planMitigacion: "Capacitación intensiva y mentoring",
          },
        ],
      },
    },
    capaDos: {
      cronograma: {
        fechaInicio: new Date("2024-10-01"),
        fechaFinPlanificada: new Date("2025-02-28"),
        hitos: [
          {
            nombre: "Diseño",
            fechaPlanificada: new Date("2024-11-15"),
            fechaReal: new Date("2024-11-30"),
            semaforo: "ROJO",
            estado: "COMPLETADO",
            avancePorcentaje: 100,
            responsable: {
              nombre: "Fernando López Vidal",
              email: "fernando.lopez@nttdata.com",
              cargo: "Solution Architect",
            },
          },
          {
            nombre: "Desarrollo Backend",
            fechaPlanificada: new Date("2024-12-31"),
            fechaReal: null,
            semaforo: "ROJO",
            estado: "RETRASADO",
            avancePorcentaje: 45,
            responsable: {
              nombre: "Andrés Molina Pérez",
              email: "andres.molina@nttdata.com",
              cargo: "Backend Developer Sr",
            },
          },
          {
            nombre: "Integración",
            fechaPlanificada: new Date("2025-01-31"),
            fechaReal: null,
            semaforo: "ROJO",
            estado: "BLOQUEADO",
            avancePorcentaje: 10,
            responsable: {
              nombre: "Carmen Ruiz Blanco",
              email: "carmen.ruiz@nttdata.com",
              cargo: "Integration Specialist",
            },
          },
          {
            nombre: "Deploy",
            fechaPlanificada: new Date("2025-02-28"),
            fechaReal: null,
            semaforo: "ROJO",
            estado: "NO_INICIADO",
            avancePorcentaje: 0,
            responsable: {
              nombre: "Diego Vargas Ortiz",
              email: "diego.vargas@nttdata.com",
              cargo: "DevOps Engineer",
            },
          },
        ],
      },
      kpis: [
        {
          nombre: "Velocity",
          valorActual: 18,
          valorObjetivo: 30,
          unidad: "story points",
        },
        {
          nombre: "Sprint Completion",
          valorActual: 55,
          valorObjetivo: 85,
          unidad: "%",
        },
        {
          nombre: "Defect Density",
          valorActual: 8.5,
          valorObjetivo: 3.0,
          unidad: "defectos/kloc",
        },
      ],
      riesgos: [
        {
          descripcion: "Retraso crítico de 4 semanas",
          severidad: "CRITICA",
          estado: "MATERIALIZADO",
        },
        {
          descripcion: "Alta rotación de personal",
          severidad: "ALTA",
          estado: "EN_MITIGACION",
        },
        {
          descripcion: "Scope creep sin control",
          severidad: "MEDIA",
          estado: "IDENTIFICADO",
        },
      ],
    },
    capaTres: {
      repositorio: {
        url: "https://github.com/logisticpro/admin-portal",
        rama: "develop",
      },
      sonarqube: {
        cobertura: 42,
        deudaTecnica: 45,
        vulnerabilidades: 8,
        rating: "D",
      },
    },
    capaCuatro: {
      scoreGlobal: {
        valor: 55,
        tendencia: "BAJANDO",
        ultimaActualizacion: new Date("2025-01-06"),
      },
    },
  },
};

module.exports = {
  mockProyectos,
  mockCapasData,
};
