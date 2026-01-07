const express = require('express');
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
