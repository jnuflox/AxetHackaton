const express = require('express');
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
