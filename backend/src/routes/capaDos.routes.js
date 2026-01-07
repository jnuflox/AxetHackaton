const express = require('express');
const router = express.Router();

const mockCapaDos = {
  '1': {
    kpis: {
      avanceHitos: 92,
      cumplimientoTareas: 88,
      cumplimientoSLAs: 95
    },
    cronograma: {
      hitos: [
        { nombre: 'M1 - Diseño', fechaPlanificada: '2024-02-15', fechaReal: '2024-02-12', estado: 'COMPLETADO', semaforo: 'VERDE' },
        { nombre: 'M2 - Módulo Transacciones', fechaPlanificada: '2024-05-30', fechaReal: '2024-05-28', estado: 'COMPLETADO', semaforo: 'VERDE' }
      ]
    }
  },
  '2': {
    kpis: {
      avanceHitos: 75,
      cumplimientoTareas: 72,
      cumplimientoSLAs: 68
    },
    cronograma: {
      hitos: [
        { nombre: 'M1 - MVP Frontend', fechaPlanificada: '2024-08-01', fechaReal: '2024-08-03', estado: 'COMPLETADO', semaforo: 'AMARILLO' },
        { nombre: 'M2 - Integración Pagos', fechaPlanificada: '2024-10-15', fechaReal: '2024-10-18', estado: 'COMPLETADO', semaforo: 'AMARILLO' }
      ]
    }
  },
  '3': {
    kpis: {
      avanceHitos: 68,
      cumplimientoTareas: 65,
      cumplimientoSLAs: 60
    },
    cronograma: {
      hitos: [
        { nombre: 'M1 - Arquitectura AWS', fechaPlanificada: '2024-10-15', fechaReal: '2024-10-20', estado: 'COMPLETADO', semaforo: 'AMARILLO' },
        { nombre: 'M2 - Migración Fase 1', fechaPlanificada: '2024-12-31', fechaReal: null, estado: 'EN_RIESGO', semaforo: 'ROJO' }
      ]
    }
  },
  '4': {
    kpis: {
      avanceHitos: 95,
      cumplimientoTareas: 92,
      cumplimientoSLAs: 98
    },
    cronograma: {
      hitos: [
        { nombre: 'M1 - Diseño UX/UI', fechaPlanificada: '2024-04-15', fechaReal: '2024-04-12', estado: 'COMPLETADO', semaforo: 'VERDE' },
        { nombre: 'M2 - MVP App', fechaPlanificada: '2024-06-30', fechaReal: '2024-06-28', estado: 'COMPLETADO', semaforo: 'VERDE' }
      ]
    }
  },
  '5': {
    kpis: {
      avanceHitos: 45,
      cumplimientoTareas: 48,
      cumplimientoSLAs: 35
    },
    cronograma: {
      hitos: [
        { nombre: 'M1 - Diseño Portal', fechaPlanificada: '2024-10-31', fechaReal: '2024-11-10', estado: 'COMPLETADO', semaforo: 'ROJO' },
        { nombre: 'M2 - Módulo Tracking', fechaPlanificada: '2024-12-15', fechaReal: null, estado: 'RETRASADO', semaforo: 'ROJO' }
      ]
    }
  }
};

router.get('/:proyectoId', async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    const capaDos = mockCapaDos[proyectoId] || mockCapaDos['1'];
    res.json({
      success: true,
      data: capaDos
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
