const mongoose = require("mongoose");

const capaDosSchema = new mongoose.Schema(
  {
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    // Cronograma
    cronograma: {
      hitos: [
        {
          nombre: String,
          descripcion: String,
          fechaInicio: Date,
          fechaFinPlanificada: Date,
          fechaFinReal: Date,
          responsable: {
            nombre: String,
            email: String,
            cargo: String,
            avatar: String,
          },
          estado: {
            type: String,
            enum: [
              "NO_INICIADO",
              "EN_PROGRESO",
              "COMPLETADO",
              "RETRASADO",
              "BLOQUEADO",
            ],
            default: "NO_INICIADO",
          },
          semaforo: {
            type: String,
            enum: ["VERDE", "AMARILLO", "ROJO"],
            default: "VERDE",
          },
          avancePorcentaje: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
          },
        },
      ],
      equipoAsignado: [
        {
          nombre: String,
          rol: String,
          dedicacion: Number, // Porcentaje de dedicación
          fechaInicio: Date,
          fechaFin: Date,
        },
      ],
      esfuerzoEstimado: Number,
      esfuerzoReal: Number,
    },
    // Integración JIRA
    jira: {
      proyectoKey: String,
      totalIssues: Number,
      issuesCompletados: Number,
      issuesEnProgreso: Number,
      issuesPendientes: Number,
      sprintActual: String,
      velocidadPromedio: Number,
      ultimaActualizacion: Date,
    },
    // KPIs Operativos
    kpis: {
      cumplimientoTareas: Number, // Porcentaje
      avanceHitos: Number, // Porcentaje
      cumplimientoSLAs: [
        {
          slaId: String,
          nombre: String,
          estado: {
            type: String,
            enum: ["CUMPLIDO", "EN_RIESGO", "INCUMPLIDO"],
          },
          valorActual: String,
          valorCompromiso: String,
          semaforo: {
            type: String,
            enum: ["VERDE", "AMARILLO", "ROJO"],
          },
        },
      ],
    },
    // Riesgos e Incidencias
    riesgos: [
      {
        descripcion: String,
        categoria: String,
        severidad: {
          type: String,
          enum: ["BAJA", "MEDIA", "ALTA", "CRITICA"],
        },
        probabilidad: String,
        impacto: String,
        planMitigacion: String,
        estado: {
          type: String,
          enum: ["IDENTIFICADO", "EN_MITIGACION", "MITIGADO", "MATERIALIZADO"],
          default: "IDENTIFICADO",
        },
        fechaIdentificacion: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Historial del proyecto
    historial: [
      {
        tipo: {
          type: String,
          enum: [
            "CHANGE_REQUEST",
            "DECISION",
            "CAMBIO_ESTRATEGIA",
            "HITO",
            "INCIDENCIA",
          ],
        },
        titulo: String,
        descripcion: String,
        fecha: {
          type: Date,
          default: Date.now,
        },
        impacto: String,
        responsable: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CapaDos", capaDosSchema);
