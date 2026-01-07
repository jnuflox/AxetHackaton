const express = require('express');
const router = express.Router();
const { mockProyectos, mockCapasData } = require('../data/mockData');

// GET - Obtener todos los proyectos (solo mockup)
router.get('/', async (req, res, next) => {
  try {
    res.json({
      success: true,
      count: mockProyectos.length,
      data: mockProyectos
    });
  } catch (error) {
    next(error);
  }
});

// GET - Obtener un proyecto por ID (solo mockup)
router.get('/:id', async (req, res, next) => {
  try {
    let proyecto = mockProyectos.find(p => p._id === req.params.id);
    
    // Agregar datos de capas si existe el proyecto
    if (proyecto && mockCapasData[req.params.id]) {
      proyecto = {
        ...proyecto,
        capaUno: mockCapasData[req.params.id].capaUno,
        capaDos: mockCapasData[req.params.id].capaDos,
        capaTres: mockCapasData[req.params.id].capaTres,
        capaCuatro: mockCapasData[req.params.id].capaCuatro
      };
    }

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado'
      });
    }

    res.json({
      success: true,
      data: proyecto
    });
  } catch (error) {
    next(error);
  }
});

// POST - Crear un nuevo proyecto (deshabilitado en modo mockup)
router.post('/', async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: 'Crear proyectos no está disponible en modo demo. Solo datos de prueba.'
    });
  } catch (error) {
    next(error);
  }
});

// PUT - Actualizar un proyecto (deshabilitado en modo mockup)
router.put('/:id', async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: 'Actualizar proyectos no está disponible en modo demo.'
    });
  } catch (error) {
    next(error);
  }
});

// DELETE - Eliminar un proyecto (deshabilitado en modo mockup)
router.delete('/:id', async (req, res, next) => {
  try {
    res.status(501).json({
      success: false,
      error: 'Eliminar proyectos no está disponible en modo demo.'
    });
  } catch (error) {
    next(error);
  }
});

// GET - Dashboard ejecutivo de un proyecto
router.get('/:id/dashboard', async (req, res, next) => {
  try {
    const proyecto = mockProyectos.find(p => p._id === req.params.id);

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        error: 'Proyecto no encontrado'
      });
    }

    // Obtener datos de capas si existen
    const capasData = mockCapasData[req.params.id] || {};

    // Construir dashboard consolidado con datos mockup
    const dashboard = {
      proyecto: {
        nombre: proyecto.nombre,
        codigo: proyecto.codigo,
        cliente: proyecto.cliente,
        estado: proyecto.estado,
        scoreGlobal: proyecto.scoreGlobal
      },
      capaUno: capasData.capaUno ? {
        presupuesto: capasData.capaUno.gecoval?.presupuesto || 0,
        duracion: capasData.capaUno.gecoval?.duracionMeses || 0,
        slasCount: capasData.capaUno.rfp?.slas?.length || 0,
        riesgosCount: capasData.capaUno.l1?.riesgosIniciales?.length || 0
      } : null,
      capaDos: capasData.capaDos ? {
        avanceHitos: capasData.capaDos.kpis?.avanceHitos || 0,
        cumplimientoTareas: capasData.capaDos.kpis?.cumplimientoTareas || 0,
        hitosVerde: capasData.capaDos.cronograma?.hitos?.filter(h => h.semaforo === 'VERDE').length || 0,
        hitosAmarillo: capasData.capaDos.cronograma?.hitos?.filter(h => h.semaforo === 'AMARILLO').length || 0,
        hitosRojo: capasData.capaDos.cronograma?.hitos?.filter(h => h.semaforo === 'ROJO').length || 0,
        riesgosActivos: capasData.capaDos.riesgos?.filter(r => r.estado !== 'MITIGADO').length || 0
      } : null,
      capaTres: capasData.capaTres ? {
        coverage: capasData.capaTres.coverage?.unitario?.lineCoverage || 0,
        vulnerabilidadesCriticas: capasData.capaTres.vulnerabilidades?.filter(v => v.severidad === 'CRITICA').length || 0,
        deudaTecnica: capasData.capaTres.sonarqube?.deudaTecnica?.total || 0,
        funcionalidadesImplementadas: capasData.capaTres.funcionalidades?.implementadas || 0,
        funcionalidadesTotal: capasData.capaTres.funcionalidades?.comprometidas || 0
      } : null,
      capaCuatro: capasData.capaCuatro ? {
        scoreGlobal: capasData.capaCuatro.scoreGlobal?.valor || 0,
        tendencia: capasData.capaCuatro.scoreGlobal?.tendencia || 'ESTABLE',
        alertasCriticas: capasData.capaCuatro.sensibilidadTecnica?.alertasTempranas?.filter(a => a.severidad === 'CRITICA').length || 0,
        probabilidadCumplimientoPlazos: capasData.capaCuatro.sensibilidadTecnica?.probabilidadCumplimientoPlazos || 0,
        proyeccionCM: capasData.capaCuatro.sensibilidadEconomica?.proyeccionCM?.proyectado || 0
      } : null,
      alertas: proyecto.alertas || []
    };

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
