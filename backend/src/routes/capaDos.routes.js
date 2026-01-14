const express = require("express");
const router = express.Router();

const mockCapaDos = {
  1: {
    kpis: {
      avanceHitos: 92,
      cumplimientoTareas: 88,
      cumplimientoSLAs: 95,
    },
    cronograma: {
      hitos: [
        {
          id: "1-1",
          nombre: "M1 - Diseño",
          fechaPlanificada: "2024-02-15",
          fechaReal: "2024-02-12",
          estado: "COMPLETADO",
          semaforo: "VERDE",
          responsable: {
            nombre: "María García López",
            email: "maria.garcia@nttdata.com",
            cargo: "Analista de Negocio Senior",
          },
          tareas: [
            {
              id: "t1-1-1",
              nombre: "Levantamiento de requerimientos funcionales",
              responsable: {
                nombre: "Ana Ruiz Pérez",
                cargo: "Analista Funcional",
              },
              fechaInicio: "2024-01-20",
              fechaFin: "2024-02-01",
              estado: "COMPLETADA",
            },
            {
              id: "t1-1-2",
              nombre: "Diseño de arquitectura de datos",
              responsable: {
                nombre: "Luis Morales Vega",
                cargo: "Arquitecto de Datos",
              },
              fechaInicio: "2024-02-01",
              fechaFin: "2024-02-08",
              estado: "COMPLETADA",
            },
            {
              id: "t1-1-3",
              nombre: "Validación de diseño con stakeholders",
              responsable: {
                nombre: "María García López",
                cargo: "Analista de Negocio Senior",
              },
              fechaInicio: "2024-02-08",
              fechaFin: "2024-02-12",
              estado: "COMPLETADA",
            },
          ],
        },
        {
          id: "1-2",
          nombre: "M2 - Módulo Transacciones",
          fechaPlanificada: "2024-05-30",
          fechaReal: "2024-05-28",
          estado: "COMPLETADO",
          semaforo: "VERDE",
          responsable: {
            nombre: "Carlos Rodríguez Martín",
            email: "carlos.rodriguez@nttdata.com",
            cargo: "Tech Lead",
          },
          tareas: [
            {
              id: "t1-2-1",
              nombre: "Desarrollo de API de transacciones",
              responsable: {
                nombre: "Jorge Sánchez Díaz",
                cargo: "Backend Developer Sr",
              },
              fechaInicio: "2024-03-01",
              fechaFin: "2024-04-15",
              estado: "COMPLETADA",
            },
            {
              id: "t1-2-2",
              nombre: "Integración con core bancario",
              responsable: {
                nombre: "Patricia Luna Mora",
                cargo: "Integration Specialist",
              },
              fechaInicio: "2024-04-15",
              fechaFin: "2024-05-10",
              estado: "COMPLETADA",
            },
            {
              id: "t1-2-3",
              nombre: "Pruebas de rendimiento",
              responsable: {
                nombre: "Roberto Vega Torres",
                cargo: "QA Engineer",
              },
              fechaInicio: "2024-05-10",
              fechaFin: "2024-05-25",
              estado: "COMPLETADA",
            },
            {
              id: "t1-2-4",
              nombre: "Documentación técnica",
              responsable: {
                nombre: "Carlos Rodríguez Martín",
                cargo: "Tech Lead",
              },
              fechaInicio: "2024-05-25",
              fechaFin: "2024-05-28",
              estado: "COMPLETADA",
            },
          ],
        },
      ],
    },
  },
  2: {
    kpis: {
      avanceHitos: 75,
      cumplimientoTareas: 72,
      cumplimientoSLAs: 68,
    },
    cronograma: {
      hitos: [
        {
          id: "2-1",
          nombre: "M1 - MVP Frontend",
          fechaPlanificada: "2024-08-01",
          fechaReal: "2024-08-03",
          estado: "COMPLETADO",
          semaforo: "AMARILLO",
          responsable: {
            nombre: "Pedro Fernández Ruiz",
            email: "pedro.fernandez@nttdata.com",
            cargo: "Product Owner",
          },
          tareas: [
            {
              id: "t2-1-1",
              nombre: "Diseño de wireframes y prototipos",
              responsable: {
                nombre: "Carolina Méndez Gil",
                cargo: "UX Designer",
              },
              fechaInicio: "2024-06-15",
              fechaFin: "2024-07-01",
              estado: "COMPLETADA",
            },
            {
              id: "t2-1-2",
              nombre: "Desarrollo de componentes base",
              responsable: {
                nombre: "Martín Vargas Cruz",
                cargo: "Frontend Developer",
              },
              fechaInicio: "2024-07-01",
              fechaFin: "2024-07-20",
              estado: "COMPLETADA",
            },
            {
              id: "t2-1-3",
              nombre: "Integración con servicios mock",
              responsable: {
                nombre: "Diego Herrera Paz",
                cargo: "Frontend Developer Sr",
              },
              fechaInicio: "2024-07-20",
              fechaFin: "2024-08-03",
              estado: "COMPLETADA",
            },
          ],
        },
        {
          id: "2-2",
          nombre: "M2 - Integración Pagos",
          fechaPlanificada: "2024-10-15",
          fechaReal: "2024-10-18",
          estado: "COMPLETADO",
          semaforo: "AMARILLO",
          responsable: {
            nombre: "Laura Gómez Torres",
            email: "laura.gomez@nttdata.com",
            cargo: "Scrum Master",
          },
          tareas: [
            {
              id: "t2-2-1",
              nombre: "Configuración de pasarela de pagos",
              responsable: {
                nombre: "Andrés Reyes Solano",
                cargo: "Backend Developer",
              },
              fechaInicio: "2024-08-15",
              fechaFin: "2024-09-10",
              estado: "COMPLETADA",
            },
            {
              id: "t2-2-2",
              nombre: "Desarrollo de flujo de checkout",
              responsable: {
                nombre: "Valeria Castro Ríos",
                cargo: "Fullstack Developer",
              },
              fechaInicio: "2024-09-10",
              fechaFin: "2024-10-01",
              estado: "COMPLETADA",
            },
            {
              id: "t2-2-3",
              nombre: "Pruebas de seguridad PCI-DSS",
              responsable: {
                nombre: "Omar Jiménez Luna",
                cargo: "Security Engineer",
              },
              fechaInicio: "2024-10-01",
              fechaFin: "2024-10-15",
              estado: "COMPLETADA",
            },
            {
              id: "t2-2-4",
              nombre: "Certificación con proveedores",
              responsable: {
                nombre: "Laura Gómez Torres",
                cargo: "Scrum Master",
              },
              fechaInicio: "2024-10-15",
              fechaFin: "2024-10-18",
              estado: "COMPLETADA",
            },
          ],
        },
      ],
    },
  },
  3: {
    kpis: {
      avanceHitos: 68,
      cumplimientoTareas: 65,
      cumplimientoSLAs: 60,
    },
    cronograma: {
      hitos: [
        {
          id: "3-1",
          nombre: "M1 - Arquitectura AWS",
          fechaPlanificada: "2024-10-15",
          fechaReal: "2024-10-20",
          estado: "COMPLETADO",
          semaforo: "AMARILLO",
          responsable: {
            nombre: "Javier Herrera Cloud",
            email: "javier.herrera@nttdata.com",
            cargo: "Cloud Architect",
          },
          tareas: [
            {
              id: "t3-1-1",
              nombre: "Diseño de infraestructura IaC",
              responsable: {
                nombre: "Ricardo Núñez Vera",
                cargo: "DevOps Engineer",
              },
              fechaInicio: "2024-09-01",
              fechaFin: "2024-09-20",
              estado: "COMPLETADA",
            },
            {
              id: "t3-1-2",
              nombre: "Configuración de VPCs y networking",
              responsable: {
                nombre: "Sandra Pinto Mejía",
                cargo: "Cloud Engineer",
              },
              fechaInicio: "2024-09-20",
              fechaFin: "2024-10-05",
              estado: "COMPLETADA",
            },
            {
              id: "t3-1-3",
              nombre: "Setup de servicios gestionados",
              responsable: {
                nombre: "Javier Herrera Cloud",
                cargo: "Cloud Architect",
              },
              fechaInicio: "2024-10-05",
              fechaFin: "2024-10-20",
              estado: "COMPLETADA",
            },
          ],
        },
        {
          id: "3-2",
          nombre: "M2 - Migración Fase 1",
          fechaPlanificada: "2024-12-31",
          fechaReal: null,
          estado: "EN_RIESGO",
          semaforo: "ROJO",
          responsable: {
            nombre: "Elena Soto Navarro",
            email: "elena.soto@nttdata.com",
            cargo: "Migration Lead",
          },
          tareas: [
            {
              id: "t3-2-1",
              nombre: "Migración de bases de datos críticas",
              responsable: {
                nombre: "Felipe Arias Montes",
                cargo: "DBA Senior",
              },
              fechaInicio: "2024-10-25",
              fechaFin: "2024-11-30",
              estado: "EN_PROGRESO",
            },
            {
              id: "t3-2-2",
              nombre: "Migración de microservicios core",
              responsable: {
                nombre: "Camila Ortiz Valle",
                cargo: "Backend Developer Sr",
              },
              fechaInicio: "2024-11-15",
              fechaFin: "2024-12-15",
              estado: "EN_PROGRESO",
            },
            {
              id: "t3-2-3",
              nombre: "Validación de integridad de datos",
              responsable: {
                nombre: "Tomás Rivera Paz",
                cargo: "Data Engineer",
              },
              fechaInicio: "2024-12-01",
              fechaFin: "2024-12-20",
              estado: "PENDIENTE",
            },
            {
              id: "t3-2-4",
              nombre: "Pruebas de regresión completas",
              responsable: { nombre: "Natalia Campos Ruiz", cargo: "QA Lead" },
              fechaInicio: "2024-12-15",
              fechaFin: "2024-12-31",
              estado: "PENDIENTE",
            },
          ],
        },
      ],
    },
  },
  4: {
    kpis: {
      avanceHitos: 95,
      cumplimientoTareas: 92,
      cumplimientoSLAs: 98,
    },
    cronograma: {
      hitos: [
        {
          id: "4-1",
          nombre: "M1 - Diseño UX/UI",
          fechaPlanificada: "2024-04-15",
          fechaReal: "2024-04-12",
          estado: "COMPLETADO",
          semaforo: "VERDE",
          responsable: {
            nombre: "Sofía Mendoza Ríos",
            email: "sofia.mendoza@nttdata.com",
            cargo: "UX/UI Designer Lead",
          },
          tareas: [
            {
              id: "t4-1-1",
              nombre: "Research de usuarios y competencia",
              responsable: {
                nombre: "Isabel Duarte Gómez",
                cargo: "UX Researcher",
              },
              fechaInicio: "2024-03-01",
              fechaFin: "2024-03-15",
              estado: "COMPLETADA",
            },
            {
              id: "t4-1-2",
              nombre: "Diseño de sistema de componentes",
              responsable: {
                nombre: "Sofía Mendoza Ríos",
                cargo: "UX/UI Designer Lead",
              },
              fechaInicio: "2024-03-15",
              fechaFin: "2024-04-01",
              estado: "COMPLETADA",
            },
            {
              id: "t4-1-3",
              nombre: "Prototipado interactivo en Figma",
              responsable: {
                nombre: "Daniela Rojas Parra",
                cargo: "UI Designer",
              },
              fechaInicio: "2024-04-01",
              fechaFin: "2024-04-12",
              estado: "COMPLETADA",
            },
          ],
        },
        {
          id: "4-2",
          nombre: "M2 - MVP App",
          fechaPlanificada: "2024-06-30",
          fechaReal: "2024-06-28",
          estado: "COMPLETADO",
          semaforo: "VERDE",
          responsable: {
            nombre: "Miguel Ángel Castro",
            email: "miguel.castro@nttdata.com",
            cargo: "Mobile Developer Lead",
          },
          tareas: [
            {
              id: "t4-2-1",
              nombre: "Setup del proyecto React Native",
              responsable: {
                nombre: "Gabriel Espinoza Díaz",
                cargo: "Mobile Developer",
              },
              fechaInicio: "2024-04-15",
              fechaFin: "2024-04-25",
              estado: "COMPLETADA",
            },
            {
              id: "t4-2-2",
              nombre: "Desarrollo de módulo de citas",
              responsable: {
                nombre: "Luciana Márquez Sol",
                cargo: "Mobile Developer Sr",
              },
              fechaInicio: "2024-04-25",
              fechaFin: "2024-05-20",
              estado: "COMPLETADA",
            },
            {
              id: "t4-2-3",
              nombre: "Integración con API de pacientes",
              responsable: {
                nombre: "Miguel Ángel Castro",
                cargo: "Mobile Developer Lead",
              },
              fechaInicio: "2024-05-20",
              fechaFin: "2024-06-10",
              estado: "COMPLETADA",
            },
            {
              id: "t4-2-4",
              nombre: "Testing en dispositivos físicos",
              responsable: {
                nombre: "Adriana Fuentes León",
                cargo: "QA Mobile",
              },
              fechaInicio: "2024-06-10",
              fechaFin: "2024-06-28",
              estado: "COMPLETADA",
            },
          ],
        },
      ],
    },
  },
  5: {
    kpis: {
      avanceHitos: 45,
      cumplimientoTareas: 48,
      cumplimientoSLAs: 35,
    },
    cronograma: {
      hitos: [
        {
          id: "5-1",
          nombre: "M1 - Diseño Portal",
          fechaPlanificada: "2024-10-31",
          fechaReal: "2024-11-10",
          estado: "COMPLETADO",
          semaforo: "ROJO",
          responsable: {
            nombre: "Fernando López Vidal",
            email: "fernando.lopez@nttdata.com",
            cargo: "Solution Architect",
          },
          tareas: [
            {
              id: "t5-1-1",
              nombre: "Definición de arquitectura técnica",
              responsable: {
                nombre: "Fernando López Vidal",
                cargo: "Solution Architect",
              },
              fechaInicio: "2024-10-01",
              fechaFin: "2024-10-15",
              estado: "COMPLETADA",
            },
            {
              id: "t5-1-2",
              nombre: "Diseño de modelo de datos",
              responsable: {
                nombre: "Esteban Quiroz Mora",
                cargo: "Data Architect",
              },
              fechaInicio: "2024-10-15",
              fechaFin: "2024-10-28",
              estado: "COMPLETADA",
            },
            {
              id: "t5-1-3",
              nombre: "Revisión y aprobación de diseño",
              responsable: {
                nombre: "Mónica Salazar Ríos",
                cargo: "Project Manager",
              },
              fechaInicio: "2024-10-28",
              fechaFin: "2024-11-10",
              estado: "COMPLETADA",
            },
          ],
        },
        {
          id: "5-2",
          nombre: "M2 - Módulo Tracking",
          fechaPlanificada: "2024-12-15",
          fechaReal: null,
          estado: "RETRASADO",
          semaforo: "ROJO",
          responsable: {
            nombre: "Andrés Molina Pérez",
            email: "andres.molina@nttdata.com",
            cargo: "Backend Developer Sr",
          },
          tareas: [
            {
              id: "t5-2-1",
              nombre: "Desarrollo de API de tracking",
              responsable: {
                nombre: "Andrés Molina Pérez",
                cargo: "Backend Developer Sr",
              },
              fechaInicio: "2024-11-10",
              fechaFin: "2024-12-01",
              estado: "EN_PROGRESO",
            },
            {
              id: "t5-2-2",
              nombre: "Integración con GPS providers",
              responsable: {
                nombre: "Sergio Varela Pinto",
                cargo: "Integration Developer",
              },
              fechaInicio: "2024-11-20",
              fechaFin: "2024-12-10",
              estado: "RETRASADA",
            },
            {
              id: "t5-2-3",
              nombre: "Dashboard de monitoreo en tiempo real",
              responsable: {
                nombre: "Paula Rivas Méndez",
                cargo: "Frontend Developer",
              },
              fechaInicio: "2024-12-01",
              fechaFin: "2024-12-15",
              estado: "PENDIENTE",
            },
            {
              id: "t5-2-4",
              nombre: "Pruebas de integración E2E",
              responsable: {
                nombre: "Héctor Guzmán Torres",
                cargo: "QA Engineer",
              },
              fechaInicio: "2024-12-10",
              fechaFin: "2024-12-20",
              estado: "PENDIENTE",
            },
          ],
        },
      ],
    },
  },
};

router.get("/:proyectoId", async (req, res, next) => {
  try {
    const { proyectoId } = req.params;
    const capaDos = mockCapaDos[proyectoId] || mockCapaDos["1"];
    res.json({
      success: true,
      data: capaDos,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
