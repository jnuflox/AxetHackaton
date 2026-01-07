const fs = require('fs');
const path = require('path');

// Estructura completa para Capa Uno
const capaUnoContent = `const express = require('express');
const router = express.Router();

// Datos mockup completos de Capa 1
const mockCapaUno = {
  '1': {
    gecoval: {
      presupuesto: 500000,
      duracionMeses: 11,
      teamMembers: 12,
      esfuerzoEstimadoHoras: 5000,
      fechaInicio: '2024-01-15',
      fechaFin: '2024-12-15'
    },
    rfp: {
      fechaEmision: '2023-11-01',
      slas: [
        { nombre: 'Disponibilidad del Sistema', metrica: 'Uptime', valorCompromiso: '99.9%' },
        { nombre: 'Tiempo de Respuesta', metrica: 'Response Time', valorCompromiso: '< 2s' },
        { nombre: 'Resolución de Incidentes Críticos', metrica: 'MTTR', valorCompromiso: '< 4h' }
      ]
    },
    propuestaEconomica: {
      presupuestoTotal: 500000,
      presupuestoBase: 450000,
      contingencia: 25000,
      reservaRiesgos: 15000,
      garantias: 5000,
      otros: 5000
    },
    l1: {
      ofertaCM: 22,
      pisoCM: 15,
      cliente: 'Banco Nacional',
      numeroContrato: 'CNT-2024-001',
      tipoContrato: 'Precio Fijo',
      alcance: 'Desarrollo e implementación de un sistema completo de gestión bancaria.',
      entregables: ['Módulo gestión de cuentas', 'Módulo transacciones', 'Sistema reportería'],
      riesgosIniciales: [
        { nombre: 'Integración sistemas legacy', nivel: 'ALTO' }
      ]
    }
  },
  '2': {
    gecoval: {
      presupuesto: 350000,
      duracionMeses: 10,
      teamMembers: 8,
      esfuerzoEstimadoHoras: 3500,
      fechaInicio: '2024-06-01',
      fechaFin: '2025-03-31'
    },
    rfp: {
      fechaEmision: '2024-04-15',
      slas: [
        { nombre: 'Velocidad de Carga', metrica: 'Page Load', valorCompromiso: '< 3s' },
        { nombre: 'Uptime', metrica: 'Availability', valorCompromiso: '99.5%' }
      ]
    },
    propuestaEconomica: {
      presupuestoTotal: 350000,
      presupuestoBase: 320000,
      contingencia: 15000,
      reservaRiesgos: 10000
    },
    l1: {
      ofertaCM: 20,
      pisoCM: 12,
      cliente: 'RetailCorp S.A.',
      numeroContrato: 'CNT-2024-002',
      tipoContrato: 'Tiempo y Materiales'
    }
  },
  '3': {
    gecoval: {
      presupuesto: 800000,
      duracionMeses: 10,
      teamMembers: 15,
      esfuerzoEstimadoHoras: 8000,
      fechaInicio: '2024-09-01',
      fechaFin: '2025-06-30'
    },
    rfp: {
      fechaEmision: '2024-07-01',
      slas: [
        { nombre: 'Disponibilidad Cloud', metrica: 'Uptime AWS', valorCompromiso: '99.95%' },
        { nombre: 'Latencia API', metrica: 'Response Time', valorCompromiso: '< 500ms' }
      ]
    },
    propuestaEconomica: {
      presupuestoTotal: 800000,
      presupuestoBase: 720000,
      contingencia: 40000,
      reservaRiesgos: 30000
    },
    l1: {
      ofertaCM: 18,
      pisoCM: 10,
      cliente: 'TechSolutions Inc.',
      numeroContrato: 'CNT-2024-003',
      tipoContrato: 'Precio Fijo'
    }
  },
  '4': {
    gecoval: {
      presupuesto: 250000,
      duracionMeses: 9,
      teamMembers: 6,
      esfuerzoEstimadoHoras: 2500,
      fechaInicio: '2024-03-01',
      fechaFin: '2024-11-30'
    },
    rfp: {
      fechaEmision: '2024-01-15',
      slas: [
        { nombre: 'Disponibilidad App', metrica: 'Uptime Mobile', valorCompromiso: '99.9%' },
        { nombre: 'Cumplimiento HIPAA', metrica: 'Compliance', valorCompromiso: '100%' }
      ]
    },
    propuestaEconomica: {
      presupuestoTotal: 250000,
      presupuestoBase: 230000,
      contingencia: 10000,
      reservaRiesgos: 7000
    },
    l1: {
      ofertaCM: 25,
      pisoCM: 18,
      cliente: 'MediPlus Clinic',
      numeroContrato: 'CNT-2024-015',
      tipoContrato: 'Tiempo y Materiales'
    }
  },
  '5': {
    gecoval: {
      presupuesto: 180000,
      duracionMeses: 5,
      teamMembers: 5,
      esfuerzoEstimadoHoras: 1800,
      fechaInicio: '2024-10-01',
      fechaFin: '2025-02-28'
    },
    rfp: {
      fechaEmision: '2024-08-15',
      slas: [
        { nombre: 'Tiempo de Respuesta', metrica: 'Page Load', valorCompromiso: '< 2s' },
        { nombre: 'Disponibilidad', metrica: 'Uptime', valorCompromiso: '99.5%' }
      ]
    },
    propuestaEconomica: {
      presupuestoTotal: 180000,
      presupuestoBase: 165000,
      contingencia: 8000,
      reservaRiesgos: 5000
    },
    l1: {
      ofertaCM: 15,
      pisoCM: 8,
      cliente: 'LogisticPro',
      numeroContrato: 'CNT-2024-004',
      tipoContrato: 'Precio Fijo'
    }
  }
};

router.get('/:proyectoId', async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    const capaUno = mockCapaUno[proyectoId] || mockCapaUno['1'];
    res.json({
      success: true,
      data: capaUno
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
`;

// Estructura completa para Capa Dos
const capasDosContent = `const express = require('express');
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
`;

// Estructura completa para Capa Tres
const capaTresContent = `const express = require('express');
const router = express.Router();

const mockCapaTres = {
  '1': {
    sonarqube: {
      deudaTecnica: { total: 8 },
      codeSmells: 45,
      duplicacion: 2.1
    },
    coverage: {
      unitario: { lineCoverage: 85 },
      integracion: { lineCoverage: 78 }
    }
  },
  '2': {
    sonarqube: {
      deudaTecnica: { total: 22 },
      codeSmells: 128,
      duplicacion: 4.8
    },
    coverage: {
      unitario: { lineCoverage: 68 },
      integracion: { lineCoverage: 62 }
    }
  },
  '3': {
    sonarqube: {
      deudaTecnica: { total: 38 },
      codeSmells: 245,
      duplicacion: 7.2
    },
    coverage: {
      unitario: { lineCoverage: 52 },
      integracion: { lineCoverage: 45 }
    }
  },
  '4': {
    sonarqube: {
      deudaTecnica: { total: 4 },
      codeSmells: 12,
      duplicacion: 1.2
    },
    coverage: {
      unitario: { lineCoverage: 92 },
      integracion: { lineCoverage: 88 }
    }
  },
  '5': {
    sonarqube: {
      deudaTecnica: { total: 45 },
      codeSmells: 385,
      duplicacion: 12.5
    },
    coverage: {
      unitario: { lineCoverage: 35 },
      integracion: { lineCoverage: 28 }
    }
  }
};

router.get('/:proyectoId', async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    const capaTres = mockCapaTres[proyectoId] || mockCapaTres['1'];
    res.json({
      success: true,
      data: capaTres
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
`;

// Estructura completa para Capa Cuatro
const capaCuatroContent = `const express = require('express');
const router = express.Router();

const mockCapaCuatro = {
  '1': {
    scoreGlobal: {
      valor: 95,
      tendencia: 'MEJORANDO',
      ultimaActualizacion: '2026-01-06'
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 96
    },
    sensibilidadEconomica: {
      proyeccionCM: { proyectado: 22 }
    }
  },
  '2': {
    scoreGlobal: {
      valor: 72,
      tendencia: 'DECRECIENTE',
      ultimaActualizacion: '2026-01-06'
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 75
    },
    sensibilidadEconomica: {
      proyeccionCM: { proyectado: 18 }
    }
  },
  '3': {
    scoreGlobal: {
      valor: 68,
      tendencia: 'DECRECIENTE',
      ultimaActualizacion: '2026-01-06'
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 65
    },
    sensibilidadEconomica: {
      proyeccionCM: { proyectado: 15 }
    }
  },
  '4': {
    scoreGlobal: {
      valor: 88,
      tendencia: 'ESTABLE',
      ultimaActualizacion: '2026-01-06'
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 98
    },
    sensibilidadEconomica: {
      proyeccionCM: { proyectado: 25 }
    }
  },
  '5': {
    scoreGlobal: {
      valor: 45,
      tendencia: 'CRÍTICO',
      ultimaActualizacion: '2026-01-06'
    },
    sensibilidadTecnica: {
      probabilidadCumplimientoPlazos: 38
    },
    sensibilidadEconomica: {
      proyeccionCM: { proyectado: 8 }
    }
  }
};

router.get('/:proyectoId', async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    const capaCuatro = mockCapaCuatro[proyectoId] || mockCapaCuatro['1'];
    res.json({
      success: true,
      data: capaCuatro
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
`;

// Escribir archivos
const routesPath = path.join(__dirname, 'src', 'routes');

fs.writeFileSync(path.join(routesPath, 'capaUno.routes.js'), capaUnoContent);
fs.writeFileSync(path.join(routesPath, 'capaDos.routes.js'), capasDosContent);
fs.writeFileSync(path.join(routesPath, 'capaTres.routes.js'), capaTresContent);
fs.writeFileSync(path.join(routesPath, 'capaCuatro.routes.js'), capaCuatroContent);

console.log('✅ Archivos de rutas actualizados con mockups completos');
console.log('🔄 Reinicia el servidor backend para aplicar cambios');
