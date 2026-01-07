const mongoose = require('mongoose');

const capaUnoSchema = new mongoose.Schema({
  proyecto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto',
    required: true
  },
  // RFP y Propuesta
  rfp: {
    documentoUrl: String,
    fechaEmision: Date,
    slas: [{
      nombre: String,
      descripcion: String,
      metrica: String,
      valorCompromiso: String
    }]
  },
  propuestaTecnica: {
    documentoUrl: String,
    alcance: String,
    tecnologias: [String],
    metodologia: String
  },
  propuestaEconomica: {
    documentoUrl: String,
    presupuestoTotal: Number,
    moneda: {
      type: String,
      default: 'USD'
    }
  },
  // GECOVAL
  gecoval: {
    duracionMeses: Number,
    teamMembers: Number,
    presupuesto: Number,
    esfuerzoEstimadoHoras: Number
  },
  // L1 y costos
  l1: {
    riesgosIniciales: [{
      descripcion: String,
      probabilidad: String,
      impacto: String,
      mitigacion: String
    }],
    ofertaCM: Number, // Contribution Margin ofertado
    pisoCM: Number, // CM mínimo aceptable
    otrosCostos: {
      cartasFianza: Number,
      garantias: Number,
      otros: [{
        concepto: String,
        monto: Number
      }]
    }
  },
  // Plan de facturación
  planFacturacion: [{
    hito: String,
    fechaEstimada: Date,
    monto: Number,
    porcentaje: Number,
    estado: {
      type: String,
      enum: ['PENDIENTE', 'FACTURADO', 'COBRADO'],
      default: 'PENDIENTE'
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('CapaUno', capaUnoSchema);
