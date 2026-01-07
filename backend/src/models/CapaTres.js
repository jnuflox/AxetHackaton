const mongoose = require('mongoose');

const capaTresSchema = new mongoose.Schema({
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: true
  },
  // Repositorio
  repositorio: {
    tipo: {
      type: String,
      enum: ['GITLAB', 'GITHUB', 'BITBUCKET', 'AZURE_DEVOPS']
    },
    url: String,
    rama: String,
    ultimoCommit: {
      hash: String,
      autor: String,
      fecha: Date,
      mensaje: String
    }
  },
  // Análisis SonarQube
  sonarqube: {
    projectKey: String,
    serverUrl: String,
    ultimoAnalisis: Date,
    metricas: {
      bugs: Number,
      vulnerabilities: Number,
      codeSmells: Number,
      coverage: Number,
      duplicatedLinesDensity: Number,
      technicalDebt: Number, // En días
      reliabilityRating: String,
      securityRating: String,
      maintainabilityRating: String
    },
    deudaTecnica: {
      total: Number, // En horas o días
      critica: Number,
      alta: Number,
      media: Number,
      baja: Number,
      tendencia: String // 'MEJORANDO', 'ESTABLE', 'EMPEORANDO'
    }
  },
  // Coverage
  coverage: {
    unitario: {
      lineCoverage: Number,
      branchCoverage: Number,
      totalLineas: Number,
      lineasCubiertas: Number
    },
    integracion: {
      lineCoverage: Number,
      branchCoverage: Number
    },
    e2e: {
      casosEjecutados: Number,
      casosExitosos: Number,
      casosFallidos: Number
    }
  },
  // Vulnerabilidades
  vulnerabilidades: [{
    tipo: String,
    severidad: {
      type: String,
      enum: ['CRITICA', 'ALTA', 'MEDIA', 'BAJA']
    },
    descripcion: String,
    archivo: String,
    linea: Number,
    recomendacion: String,
    estado: {
      type: String,
      enum: ['ABIERTA', 'EN_REVISION', 'RESUELTA', 'ACEPTADA'],
      default: 'ABIERTA'
    }
  }],
  // Antipatrones
  antipatrones: [{
    nombre: String,
    descripcion: String,
    ubicacion: String,
    impacto: String,
    sugerencia: String
  }],
  // Estándares del cliente
  cumplimientoEstandares: {
    checklistTotal: Number,
    checklistCompletados: Number,
    porcentajeCumplimiento: Number,
    itemsIncumplidos: [{
      estandar: String,
      descripcion: String,
      estado: String
    }]
  },
  // Funcionalidades
  funcionalidades: {
    comprometidas: Number,
    implementadas: Number,
    enDesarrollo: Number,
    pendientes: Number,
    detalle: [{
      nombre: String,
      descripcion: String,
      estado: {
        type: String,
        enum: ['PENDIENTE', 'EN_DESARROLLO', 'IMPLEMENTADA', 'EN_REVISION']
      },
      prioridad: String,
      complejidad: String
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CapaTres', capaTresSchema);
