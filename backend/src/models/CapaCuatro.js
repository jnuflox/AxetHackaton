const mongoose = require('mongoose');

const capaCuatroSchema = new mongoose.Schema({
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: true
  },
  // Score de salud del proyecto
  scoreGlobal: {
    valor: {
      type: Number,
      min: 0,
      max: 100
    },
    ultimaActualizacion: Date,
    tendencia: {
      type: String,
      enum: ['MEJORANDO', 'ESTABLE', 'EMPEORANDO']
    }
  },
  // Análisis de Sensibilidad Técnica
  sensibilidadTecnica: {
    probabilidadCumplimientoPlazos: Number, // 0-100
    prediccionEntregaHitos: [{
      hitoId: String,
      nombreHito: String,
      fechaPlanificada: Date,
      fechaPredicha: Date,
      confianza: Number, // 0-100
      riesgoRetraso: {
        type: String,
        enum: ['BAJO', 'MEDIO', 'ALTO', 'CRITICO']
      }
    }],
    riesgoIncumplimientoSLAs: [{
      slaId: String,
      nombreSLA: String,
      probabilidadIncumplimiento: Number,
      factoresRiesgo: [String]
    }],
    alertasTempranas: [{
      tipo: String,
      severidad: {
        type: String,
        enum: ['BAJA', 'MEDIA', 'ALTA', 'CRITICA']
      },
      descripcion: String,
      metricas: [{
        nombre: String,
        valorActual: Number,
        valorEsperado: Number,
        desviacion: Number
      }],
      accionesRecomendadas: [String],
      fecha: {
        type: Date,
        default: Date.now
      }
    }]
  },
  // Análisis de Sensibilidad Económica
  sensibilidadEconomica: {
    proyeccionCM: {
      actual: Number,
      proyectado: Number,
      tendencia: String,
      confianza: Number
    },
    forecastBudget: {
      presupuestoInicial: Number,
      gastadoAcumulado: Number,
      proyeccionFinal: Number,
      desviacion: Number,
      desviacionPorcentaje: Number
    },
    funding: {
      asignado: Number,
      consumido: Number,
      proyeccionConsumo: Number,
      mesesRestantes: Number
    },
    workInProgress: {
      valorActual: Number,
      tendencia: String
    },
    riesgoWriteOff: {
      probabilidad: Number, // 0-100
      montoEnRiesgo: Number,
      factores: [String]
    },
    proyeccionRentabilidad: {
      rentabilidadEsperada: Number,
      rentabilidadProyectada: Number,
      confianza: Number
    }
  },
  // Escenarios What-If
  escenariosWhatIf: [{
    nombre: String,
    descripcion: String,
    variables: [{
      nombre: String,
      valorBase: mongoose.Schema.Types.Mixed,
      valorEscenario: mongoose.Schema.Types.Mixed
    }],
    impactos: {
      tiempo: {
        diasDiferencia: Number,
        nuevaFechaFin: Date
      },
      costo: {
        diferenciaMonto: Number,
        nuevoCostoTotal: Number
      },
      alcance: String,
      calidad: String
    },
    probabilidad: Number,
    recomendacion: String,
    fechaCreacion: {
      type: Date,
      default: Date.now
    }
  }],
  // Recomendaciones automatizadas
  recomendaciones: [{
    tipo: {
      type: String,
      enum: ['ACCION_CORRECTIVA', 'OPTIMIZACION', 'PREVENTIVA', 'ESTRATEGICA']
    },
    prioridad: {
      type: String,
      enum: ['BAJA', 'MEDIA', 'ALTA', 'URGENTE']
    },
    titulo: String,
    descripcion: String,
    impactoEstimado: String,
    esfuerzoRequerido: String,
    beneficioEsperado: String,
    estado: {
      type: String,
      enum: ['PENDIENTE', 'EN_IMPLEMENTACION', 'IMPLEMENTADA', 'RECHAZADA'],
      default: 'PENDIENTE'
    },
    fechaGeneracion: {
      type: Date,
      default: Date.now
    }
  }],
  // Datos históricos para ML
  datosHistoricos: {
    proyectosSimilares: [{
      proyectoId: String,
      similitud: Number,
      resultado: String,
      leccionesAprendidas: [String]
    }],
    patronesIdentificados: [{
      patron: String,
      frecuencia: Number,
      impacto: String
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CapaCuatro', capaCuatroSchema);
