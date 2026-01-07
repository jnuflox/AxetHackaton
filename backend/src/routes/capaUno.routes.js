const express = require('express');
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
