const express = require("express");
const SonarQubeController = require("../controllers/sonarqube.controller");

const router = express.Router();

/**
 * @swagger
 * /api/sonar/status:
 *   get:
 *     summary: Verifica la conectividad con SonarQube
 *     tags: [SonarQube]
 *     parameters:
 *       - in: query
 *         name: projectCode
 *         schema:
 *           type: string
 *         description: Código del proyecto para obtener configuración específica
 *     responses:
 *       200:
 *         description: Estado de conectividad con SonarQube
 */
router.get("/status", SonarQubeController.checkSonarStatus);

/**
 * @swagger
 * /api/sonar/sync/{projectCode}:
 *   post:
 *     summary: Sincroniza métricas de SonarQube para un proyecto específico
 *     tags: [SonarQube]
 *     parameters:
 *       - in: path
 *         name: projectCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del proyecto
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               forceUpdate:
 *                 type: boolean
 *                 description: Forzar actualización aunque ya existan datos recientes
 *     responses:
 *       200:
 *         description: Métricas sincronizadas exitosamente
 *       404:
 *         description: Proyecto no encontrado en SonarQube
 *       503:
 *         description: No se pudo conectar con SonarQube
 */
router.post("/sync/:projectCode", SonarQubeController.syncProjectMetrics);

/**
 * @swagger
 * /api/sonar/sync-all:
 *   post:
 *     summary: Sincroniza métricas de todos los proyectos configurados
 *     tags: [SonarQube]
 *     responses:
 *       200:
 *         description: Sincronización completada
 */
router.post("/sync-all", SonarQubeController.syncAllProjects);

/**
 * @swagger
 * /api/sonar/metrics/{projectCode}:
 *   get:
 *     summary: Obtiene las métricas más recientes de un proyecto
 *     tags: [SonarQube]
 *     parameters:
 *       - in: path
 *         name: projectCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del proyecto
 *     responses:
 *       200:
 *         description: Métricas del proyecto
 *       404:
 *         description: No se encontraron métricas para el proyecto
 */
router.get("/metrics/:projectCode", SonarQubeController.getLatestMetrics);

/**
 * @swagger
 * /api/sonar/history/{projectCode}:
 *   get:
 *     summary: Obtiene el histórico de métricas de un proyecto
 *     tags: [SonarQube]
 *     parameters:
 *       - in: path
 *         name: projectCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del proyecto
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número máximo de registros a retornar
 *     responses:
 *       200:
 *         description: Histórico de métricas del proyecto
 */
router.get("/history/:projectCode", SonarQubeController.getMetricsHistory);

/**
 * @swagger
 * /api/sonar/quality/{projectCode}:
 *   get:
 *     summary: Obtiene métricas de calidad específicas de SonarQube
 *     tags: [SonarQube]
 *     parameters:
 *       - in: path
 *         name: projectCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del proyecto
 *     responses:
 *       200:
 *         description: Métricas de calidad y mantenibilidad
 */
router.get("/quality/:projectCode", SonarQubeController.getQualityMetrics);

/**
 * @swagger
 * /api/sonar/security/{projectCode}:
 *   get:
 *     summary: Obtiene métricas de seguridad específicas de SonarQube
 *     tags: [SonarQube]
 *     parameters:
 *       - in: path
 *         name: projectCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del proyecto
 *     responses:
 *       200:
 *         description: Métricas de seguridad
 */
router.get("/security/:projectCode", SonarQubeController.getSecurityMetrics);

/**
 * @swagger
 * /api/sonar/tests/{projectCode}:
 *   get:
 *     summary: Obtiene métricas de pruebas y cobertura de SonarQube
 *     tags: [SonarQube]
 *     parameters:
 *       - in: path
 *         name: projectCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del proyecto
 *     responses:
 *       200:
 *         description: Métricas de pruebas y cobertura
 */
router.get("/tests/:projectCode", SonarQubeController.getTestMetrics);

module.exports = router;
