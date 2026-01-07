const mongoose = require('mongoose');

const proyectoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cliente: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['PLANIFICACION', 'EN_EJECUCION', 'EN_CIERRE', 'CERRADO', 'CANCELADO'],
    default: 'PLANIFICACION'
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFinPlanificada: {
    type: Date,
    required: true
  },
  fechaFinReal: {
    type: Date
  },
  capaUno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapaUno'
  },
  capaDos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapaDos'
  },
  capaTres: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapaTres'
  },
  capaCuatro: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CapaCuatro'
  },
  scoreGlobal: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  alertas: [{
    tipo: String,
    severidad: {
      type: String,
      enum: ['BAJA', 'MEDIA', 'ALTA', 'CRITICA']
    },
    mensaje: String,
    fecha: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Proyecto', proyectoSchema);
