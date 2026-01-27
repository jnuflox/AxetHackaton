const express = require("express");
const router = express.Router();
const genaiService = require("../services/genai-analysis.service");
const logger = require("../utils/logger");

// Función para obtener fecha/hora actual formateada
const getTimestampActual = () => {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
};

const mockCapaCuatro = {
  1: {
    scoreGlobal: {
      valor: 95,
      tendencia: "MEJORANDO",
      ultimaActualizacion: getTimestampActual(),
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 96,
      prediccionEntregaHitos: [
        {
          nombreHito: "M3 - Integración",
          fechaPlanificada: "2024-03-15",
          fechaPredicha: "2024-03-12",
          confianza: 92,
          riesgoRetraso: "BAJO",
        },
      ],
      alertasTempranas: [],
    },
    sensibilidadEconomica: {
      proyeccionCM: {
        actual: 20,
        proyectado: 22,
        tendencia: "MEJORANDO",
        confianza: 88,
      },
      forecastBudget: {
        presupuestoInicial: 500000,
        gastadoAcumulado: 485000,
        proyeccionFinal: 495000,
        desviacionPorcentaje: -1,
      },
      riesgoWriteOff: { probabilidad: 2, montoEnRiesgo: 5000, factores: [] },
    },
    recomendaciones: [
      {
        tipo: "OPTIMIZACION",
        prioridad: "BAJA",
        categoria: "Eficiencia",
        descripcion: "Mantener las prácticas actuales de gestión",
        impactoEsperado: "Sostenibilidad del proyecto",
      },
    ],
  },
  2: {
    scoreGlobal: {
      valor: 72,
      tendencia: "DECRECIENTE",
      ultimaActualizacion: getTimestampActual(),
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 75,
      prediccionEntregaHitos: [
        {
          nombreHito: "Go-Live",
          fechaPlanificada: "2025-03-31",
          fechaPredicha: "2025-04-15",
          confianza: 68,
          riesgoRetraso: "ALTO",
        },
      ],
      alertasTempranas: [
        {
          tipo: "RETRASO_SPRINT",
          severidad: "ALTA",
          descripcion: "Sprint 8 con 3 días de retraso acumulado",
          fechaDeteccion: "2025-01-05",
        },
        {
          tipo: "COBERTURA_CODIGO",
          severidad: "MEDIA",
          descripcion: "Cobertura bajó de 80% a 68%",
          fechaDeteccion: "2025-01-04",
        },
      ],
    },
    sensibilidadEconomica: {
      proyeccionCM: {
        actual: 20,
        proyectado: 18,
        tendencia: "DECRECIENTE",
        confianza: 72,
      },
      forecastBudget: {
        presupuestoInicial: 350000,
        gastadoAcumulado: 210000,
        proyeccionFinal: 385000,
        desviacionPorcentaje: 10,
      },
      riesgoWriteOff: {
        probabilidad: 15,
        montoEnRiesgo: 35000,
        factores: ["Retrasos acumulados", "Rotación de equipo"],
      },
    },
    recomendaciones: [
      {
        tipo: "ACCION_CORRECTIVA",
        prioridad: "ALTA",
        categoria: "Velocidad",
        descripcion:
          "Reforzar equipo con 2 desarrolladores senior para recuperar velocidad",
        impactoEsperado: "+15% velocidad en 2 sprints",
      },
      {
        tipo: "PREVENTIVA",
        prioridad: "MEDIA",
        categoria: "Calidad",
        descripcion:
          "Implementar pair programming para mejorar cobertura de código",
        impactoEsperado: "+12% cobertura en 3 semanas",
      },
    ],
  },
  3: {
    scoreGlobal: {
      valor: 68,
      tendencia: "DECRECIENTE",
      ultimaActualizacion: getTimestampActual(),
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 65,
      prediccionEntregaHitos: [
        {
          nombreHito: "Migración Fase 1",
          fechaPlanificada: "2025-02-28",
          fechaPredicha: "2025-03-20",
          confianza: 60,
          riesgoRetraso: "CRITICO",
        },
        {
          nombreHito: "Migración Completa",
          fechaPlanificada: "2025-06-30",
          fechaPredicha: "2025-07-30",
          confianza: 55,
          riesgoRetraso: "ALTO",
        },
      ],
      alertasTempranas: [
        {
          tipo: "VULNERABILIDAD",
          severidad: "CRITICA",
          descripcion: "2 vulnerabilidades críticas en dependencias detectadas",
          fechaDeteccion: "2025-01-06",
        },
        {
          tipo: "SOBRECOSTO",
          severidad: "ALTA",
          descripcion:
            "Proyección de sobrecosto del 15% respecto al presupuesto",
          fechaDeteccion: "2025-01-03",
        },
        {
          tipo: "RECURSO",
          severidad: "MEDIA",
          descripcion: "Arquitecto cloud con ausencia programada en febrero",
          fechaDeteccion: "2025-01-02",
        },
      ],
    },
    sensibilidadEconomica: {
      proyeccionCM: {
        actual: 18,
        proyectado: 15,
        tendencia: "DECRECIENTE",
        confianza: 65,
      },
      forecastBudget: {
        presupuestoInicial: 800000,
        gastadoAcumulado: 420000,
        proyeccionFinal: 920000,
        desviacionPorcentaje: 15,
      },
      riesgoWriteOff: {
        probabilidad: 25,
        montoEnRiesgo: 120000,
        factores: [
          "Costos AWS mayores",
          "Retrasos en migración",
          "Vulnerabilidades de seguridad",
        ],
      },
    },
    recomendaciones: [
      {
        tipo: "ACCION_CORRECTIVA",
        prioridad: "URGENTE",
        categoria: "Seguridad",
        descripcion:
          "Actualizar dependencias con vulnerabilidades críticas inmediatamente",
        impactoEsperado: "Eliminación de riesgos de seguridad",
      },
      {
        tipo: "ESTRATEGICA",
        prioridad: "ALTA",
        categoria: "Costos",
        descripcion:
          "Revisar arquitectura cloud para optimizar costos de infraestructura",
        impactoEsperado: "Reducción 20% costos AWS",
      },
      {
        tipo: "PREVENTIVA",
        prioridad: "MEDIA",
        categoria: "Recursos",
        descripcion:
          "Identificar backup para arquitecto cloud durante su ausencia",
        impactoEsperado: "Continuidad operativa",
      },
    ],
  },
  4: {
    scoreGlobal: {
      valor: 88,
      tendencia: "ESTABLE",
      ultimaActualizacion: getTimestampActual(),
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 98,
      prediccionEntregaHitos: [],
      alertasTempranas: [],
    },
    sensibilidadEconomica: {
      proyeccionCM: {
        actual: 24,
        proyectado: 25,
        tendencia: "ESTABLE",
        confianza: 95,
      },
      forecastBudget: {
        presupuestoInicial: 250000,
        gastadoAcumulado: 248000,
        proyeccionFinal: 248000,
        desviacionPorcentaje: -0.8,
      },
      riesgoWriteOff: { probabilidad: 1, montoEnRiesgo: 2000, factores: [] },
    },
    recomendaciones: [
      {
        tipo: "OPTIMIZACION",
        prioridad: "BAJA",
        categoria: "Documentación",
        descripcion:
          "Documentar lecciones aprendidas para futuros proyectos similares",
        impactoEsperado: "Mejora en proyectos futuros",
      },
    ],
  },
  5: {
    scoreGlobal: {
      valor: 45,
      tendencia: "CRÍTICO",
      ultimaActualizacion: getTimestampActual(),
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 38,
      prediccionEntregaHitos: [
        {
          nombreHito: "Desarrollo Backend",
          fechaPlanificada: "2024-12-31",
          fechaPredicha: "2025-02-15",
          confianza: 40,
          riesgoRetraso: "CRITICO",
        },
        {
          nombreHito: "Deploy",
          fechaPlanificada: "2025-02-28",
          fechaPredicha: "2025-04-30",
          confianza: 35,
          riesgoRetraso: "CRITICO",
        },
      ],
      alertasTempranas: [
        {
          tipo: "RETRASO_CRITICO",
          severidad: "CRITICA",
          descripcion: "Proyecto con 4 semanas de retraso acumulado",
          fechaDeteccion: "2025-01-06",
        },
        {
          tipo: "DEUDA_TECNICA",
          severidad: "ALTA",
          descripcion: "Deuda técnica de 45 días - SonarQube Rating D",
          fechaDeteccion: "2025-01-05",
        },
        {
          tipo: "ROTACION_PERSONAL",
          severidad: "ALTA",
          descripcion: "3 desarrolladores renunciaron en el último mes",
          fechaDeteccion: "2025-01-04",
        },
        {
          tipo: "SCOPE_CREEP",
          severidad: "MEDIA",
          descripcion: "8 change requests en desarrollo sin aprobación formal",
          fechaDeteccion: "2025-01-03",
        },
      ],
    },
    sensibilidadEconomica: {
      proyeccionCM: {
        actual: 12,
        proyectado: 8,
        tendencia: "CRITICO",
        confianza: 50,
      },
      forecastBudget: {
        presupuestoInicial: 180000,
        gastadoAcumulado: 195000,
        proyeccionFinal: 270000,
        desviacionPorcentaje: 50,
      },
      riesgoWriteOff: {
        probabilidad: 45,
        montoEnRiesgo: 90000,
        factores: [
          "Sobrecosto severo",
          "Retrasos críticos",
          "Rotación de personal",
          "Scope creep",
        ],
      },
    },
    recomendaciones: [
      {
        tipo: "ACCION_CORRECTIVA",
        prioridad: "URGENTE",
        categoria: "Gestión",
        descripcion:
          "Escalamiento ejecutivo inmediato - proyecto en estado crítico",
        impactoEsperado: "Visibilidad y soporte directivo",
      },
      {
        tipo: "ACCION_CORRECTIVA",
        prioridad: "URGENTE",
        categoria: "Scope",
        descripcion:
          "Congelar scope y formalizar todos los change requests pendientes",
        impactoEsperado: "Control del alcance",
      },
      {
        tipo: "ESTRATEGICA",
        prioridad: "ALTA",
        categoria: "Equipo",
        descripcion:
          "Onboarding acelerado de 3 recursos senior para cubrir vacantes",
        impactoEsperado: "Recuperación de capacidad en 3 semanas",
      },
      {
        tipo: "PREVENTIVA",
        prioridad: "ALTA",
        categoria: "Calidad",
        descripcion: "Sprint dedicado a reducción de deuda técnica crítica",
        impactoEsperado: "Mejora de mantenibilidad y velocidad",
      },
    ],
  },
};

// Conectores disponibles para integración
const conectoresDisponibles = [
  {
    id: "jira",
    nombre: "Jira",
    descripcion: "Gestión de proyectos y seguimiento de issues",
    categoria: "Gestión de Proyectos",
    icono: "fab fa-jira",
    color: "#0052CC",
    datosObtenidos: ["Sprints", "Issues", "Velocidad", "Burndown", "Backlog"],
    estado: "ACTIVO",
    ultimaSync: getTimestampActual(),
  },
  {
    id: "github",
    nombre: "GitHub",
    descripcion: "Plataforma de desarrollo colaborativo",
    categoria: "Control de Versiones",
    icono: "fab fa-github",
    color: "#333333",
    datosObtenidos: [
      "Commits",
      "Pull Requests",
      "Actions",
      "Issues",
      "Projects",
    ],
    estado: "ACTIVO",
    ultimaSync: getTimestampActual(),
  },
  {
    id: "teams",
    nombre: "Microsoft Teams",
    descripcion: "Colaboración y comunicación empresarial",
    categoria: "Comunicación",
    icono: "fab fa-microsoft",
    color: "#6264A7",
    datosObtenidos: ["Reuniones", "Chats", "Canales", "Archivos"],
    estado: "ACTIVO",
    ultimaSync: getTimestampActual(),
  },
  {
    id: "sharepoint",
    nombre: "SharePoint",
    descripcion: "Plataforma de colaboración y gestión de documentos",
    categoria: "Documentación",
    icono: "fab fa-microsoft",
    color: "#0078D4",
    datosObtenidos: ["Documentos", "Listas", "Sitios", "Flujos de trabajo"],
    estado: "DISPONIBLE",
    ultimaSync: null,
  },
  {
    id: "confluence",
    nombre: "Confluence",
    descripcion: "Documentación y colaboración de equipos",
    categoria: "Documentación",
    icono: "fab fa-confluence",
    color: "#172B4D",
    datosObtenidos: ["Páginas", "Espacios", "Comentarios", "Actualizaciones"],
    estado: "ACTIVO",
    ultimaSync: getTimestampActual(),
  },
  {
    id: "sonarqube",
    nombre: "SonarQube",
    descripcion: "Análisis de calidad y seguridad del código",
    categoria: "Calidad de Código",
    icono: "fas fa-bug",
    color: "#4E9BCD",
    datosObtenidos: [
      "Cobertura",
      "Deuda Técnica",
      "Vulnerabilidades",
      "Code Smells",
      "Bugs",
    ],
    estado: "ACTIVO",
    ultimaSync: getTimestampActual(),
  },
  {
    id: "outlook",
    nombre: "Outlook",
    descripcion: "Cliente de correo electrónico y calendario",
    categoria: "Comunicación",
    icono: "fab fa-microsoft",
    color: "#0078D4",
    datosObtenidos: ["Correos", "Calendarios", "Contactos", "Tareas"],
    estado: "DISPONIBLE",
    ultimaSync: null,
  },
];

router.get("/:proyectoId", async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    const capaCuatro = mockCapaCuatro[proyectoId] || mockCapaCuatro["1"];

    // Agregar conectores a la respuesta
    capaCuatro.conectores = conectoresDisponibles;

    res.json({
      success: true,
      data: capaCuatro,
    });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// ENDPOINTS GenAI - Análisis Predictivo con Inteligencia Artificial
// ============================================================================

/**
 * POST /:proyectoId/analyze-genai
 * Ejecuta análisis GenAI con datos de capas 1, 2, 3 y conectores seleccionados
 */
router.post("/:proyectoId/analyze-genai", async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    const { conectoresSeleccionados, tipoAnalisis } = req.body;

    logger.info(`Iniciando análisis GenAI para proyecto ${proyectoId}`);

    // Mock de datos de capas 1, 2, 3 (en producción vendría de la BD)
    const mockCapaUno = {
      rfp: {
        slas: [
          { tipo: "DISPONIBILIDAD", valor: 99.5, unidad: "%" },
          { tipo: "TIEMPO_RESPUESTA", valor: 2, unidad: "segundos" }
        ]
      },
      gecoval: {
        presupuesto: 500000,
        esfuerzoEstimadoHoras: 8000
      },
      l1: {
        ofertaCM: 22,
        pisoCM: 15,
        riesgosIniciales: ["Integración sistemas legacy", "Disponibilidad recursos"]
      },
      propuestaEconomica: {
        presupuestoTotal: 500000
      }
    };

    const mockCapaDos = {
      cronograma: {
        hitos: [
          { nombre: "M1 - Kickoff", estado: "COMPLETADO", semaforo: "VERDE", avancePorcentaje: 100, fechaFinPlanificada: "2024-01-15", fechaFinReal: "2024-01-14" },
          { nombre: "M2 - Diseño", estado: "COMPLETADO", semaforo: "VERDE", avancePorcentaje: 100, fechaFinPlanificada: "2024-02-15", fechaFinReal: "2024-02-20" },
          { nombre: "M3 - Desarrollo", estado: "EN_PROGRESO", semaforo: "AMARILLO", avancePorcentaje: 65, fechaFinPlanificada: "2024-04-01" },
          { nombre: "M4 - Testing", estado: "PENDIENTE", semaforo: "VERDE", avancePorcentaje: 0, fechaFinPlanificada: "2024-05-01" }
        ],
        equipoAsignado: ["DEV001", "DEV002", "DEV003", "QA001"],
        esfuerzoReal: 4200,
        esfuerzoEstimado: 4000
      },
      jira: {
        velocidadPromedio: 42,
        issuesCompletados: 156,
        issuesPendientes: 48,
        sprintActual: "Sprint 12"
      },
      kpis: {
        cumplimientoTareas: 82,
        avanceHitos: 75,
        cumplimientoSLAs: [
          { sla: "Disponibilidad", cumplimiento: 99.8 },
          { sla: "Tiempo Respuesta", cumplimiento: 98.5 }
        ]
      },
      riesgos: [
        { id: "R001", descripcion: "Dependencia de API externa", estado: "ACTIVO", probabilidad: 60, impacto: "ALTO" },
        { id: "R002", descripcion: "Rotación de personal", estado: "MITIGADO", probabilidad: 30, impacto: "MEDIO" }
      ]
    };

    const mockCapaTres = {
      sonarqube: {
        metricas: {
          bugs: 12,
          vulnerabilities: 3,
          codeSmells: 89,
          coverage: 72,
          duplicatedLinesDensity: 4.2,
          technicalDebt: 18,
          reliabilityRating: "B",
          securityRating: "A",
          maintainabilityRating: "B"
        },
        deudaTecnica: {
          totalDias: 18,
          categorias: {
            reliability: 5,
            security: 3,
            maintainability: 10
          }
        }
      },
      coverage: {
        unitario: { lineCoverage: 75, branchCoverage: 68 },
        integracion: { lineCoverage: 65, branchCoverage: 55 }
      },
      vulnerabilidades: [
        { id: "V001", severidad: "ALTA", estado: "ABIERTA", descripcion: "SQL Injection potencial" },
        { id: "V002", severidad: "MEDIA", estado: "EN_REMEDIACION", descripcion: "XSS reflejado" }
      ],
      antipatrones: ["God Class detectada", "Código duplicado en módulo Auth"],
      cumplimientoEstandares: {
        OWASP: 85,
        cleanCode: 78,
        sonarRules: 92
      }
    };

    // Mapear IDs de conectores a objetos completos con estado ACTIVO
    let conectores;
    if (conectoresSeleccionados && conectoresSeleccionados.length > 0) {
      conectores = conectoresSeleccionados.map(id => {
        // Si es un objeto, usarlo directamente
        if (typeof id === 'object') return id;
        // Si es un string (ID), buscar en conectores disponibles o crear objeto
        const conectorEncontrado = conectoresDisponibles.find(c => c.id === id);
        return conectorEncontrado 
          ? { ...conectorEncontrado, estado: 'ACTIVO' }
          : { id: id, nombre: id.charAt(0).toUpperCase() + id.slice(1), estado: 'ACTIVO' };
      });
    } else {
      conectores = conectoresDisponibles.filter(c => c.estado === "ACTIVO");
    }

    logger.info(`Conectores para análisis: ${JSON.stringify(conectores.map(c => ({id: c.id, nombre: c.nombre, estado: c.estado})))}`);

    // Ejecutar análisis GenAI
    const resultado = await genaiService.executeAnalysis(
      proyectoId,
      mockCapaUno,
      mockCapaDos,
      mockCapaTres,
      conectores,
      tipoAnalisis || "FULL"
    );

    res.json({
      success: true,
      data: resultado
    });
  } catch (error) {
    logger.error("Error en análisis GenAI:", error);
    next(error);
  }
});

/**
 * GET /:proyectoId/genai-insights
 * Obtiene los últimos insights generados por GenAI para un proyecto
 */
router.get("/:proyectoId/genai-insights", async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    
    // En producción, esto vendría de la base de datos
    // Por ahora retornamos los datos mock de capa4 con insights adicionales
    const capaCuatro = mockCapaCuatro[proyectoId] || mockCapaCuatro["1"];
    
    res.json({
      success: true,
      data: {
        proyectoId,
        ultimoAnalisis: capaCuatro.scoreGlobal?.ultimaActualizacion,
        insights: {
          scoreGlobal: capaCuatro.scoreGlobal,
          sensibilidadTecnica: capaCuatro.sensibilidadTecnica,
          sensibilidadEconomica: capaCuatro.sensibilidadEconomica,
          recomendaciones: capaCuatro.recomendaciones
        }
      }
    });
  } catch (error) {
    logger.error("Error obteniendo insights GenAI:", error);
    next(error);
  }
});

/**
 * GET /conectores
 * Lista todos los conectores disponibles para integración
 */
router.get("/config/conectores", async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: conectoresDisponibles
    });
  } catch (error) {
    next(error);
  }
});


/**
 * GET /config/conectores
 */
router.get("/config/conectores", async (req, res, next) => {
  try {
    res.json({ success: true, data: conectoresDisponibles });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
