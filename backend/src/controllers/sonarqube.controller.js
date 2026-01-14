const SonarQubeService = require("../services/sonarqube.service");
const sonarDB = require("../config/sonar-database");
const logger = require("../utils/logger");

class SonarQubeController {
  /**
   * Obtiene la configuración de SonarQube del proyecto
   */
  static getSonarConfig(projectCode) {
    // En un entorno real, esto vendría de la configuración del proyecto
    // Por ahora usamos valores por defecto
    const configs = {
      "PROJ-2025-001": {
        serverUrl: process.env.SONAR_SERVER_URL || "http://localhost:9000",
        projectKey: "sistema-gestion-bancaria",
        token: process.env.SONAR_TOKEN || null,
      },
      "PROJ-2025-002": {
        serverUrl: process.env.SONAR_SERVER_URL || "http://localhost:9000",
        projectKey: "plataforma-ecommerce",
        token: process.env.SONAR_TOKEN || null,
      },
      "PROJ-2025-003": {
        serverUrl: process.env.SONAR_SERVER_URL || "http://localhost:9000",
        projectKey: "migracion-cloud-aws",
        token: process.env.SONAR_TOKEN || null,
      },
      default: {
        serverUrl: process.env.SONAR_SERVER_URL || "http://localhost:9000",
        projectKey: projectCode.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        token: process.env.SONAR_TOKEN || null,
      },
    };

    return configs[projectCode] || configs.default;
  }

  /**
   * Sincroniza métricas de SonarQube para un proyecto
   * POST /api/sonar/sync/:projectCode
   */
  static async syncProjectMetrics(req, res, next) {
    try {
      const { projectCode } = req.params;
      const { forceUpdate = false } = req.body;

      logger.info(
        `Iniciando sincronización de métricas SonarQube para proyecto: ${projectCode}`
      );

      // Obtener configuración de SonarQube para el proyecto
      const config = SonarQubeController.getSonarConfig(projectCode);
      const sonarService = new SonarQubeService(config.serverUrl, config.token);

      // Verificar conectividad con SonarQube
      const connectionTest = await sonarService.testConnection();
      if (!connectionTest.connected) {
        return res.status(503).json({
          success: false,
          error: "No se pudo conectar con SonarQube",
          details: connectionTest.error,
        });
      }

      // Obtener o crear el proyecto en la base de datos
      let project = await sonarDB.getProjectByCode(projectCode);
      if (!project) {
        const projectInfo = await sonarService.getProjectInfo(
          config.projectKey
        );
        if (!projectInfo) {
          return res.status(404).json({
            success: false,
            error: `Proyecto ${config.projectKey} no encontrado en SonarQube`,
          });
        }

        await sonarDB.upsertProject({
          codigo: projectCode,
          nombre: projectInfo.name,
          sonarProjectKey: config.projectKey,
          sonarServerUrl: config.serverUrl,
        });

        project = await sonarDB.getProjectByCode(projectCode);
      }

      // Obtener todas las métricas de SonarQube
      const allMetrics = await sonarService.getAllMetrics(config.projectKey);

      // Insertar métricas de calidad
      const qualityResult = await sonarDB.insertQualityMetrics(
        project.id,
        allMetrics.qualityMetrics
      );

      // Insertar métricas de seguridad
      const securityResult = await sonarDB.insertSecurityMetrics(
        project.id,
        allMetrics.securityMetrics
      );

      // Insertar métricas de pruebas
      const testResult = await sonarDB.insertTestMetrics(
        project.id,
        allMetrics.testMetrics
      );

      // Insertar registro de análisis
      const analysisResult = await sonarDB.insertAnalysisHistory(
        project.id,
        allMetrics.analysisInfo,
        {
          qualityMetricsId: qualityResult.id,
          securityMetricsId: securityResult.id,
          testMetricsId: testResult.id,
        }
      );

      logger.info(
        `Métricas sincronizadas exitosamente para proyecto: ${projectCode}`
      );

      res.json({
        success: true,
        message: "Métricas sincronizadas exitosamente",
        data: {
          projectCode,
          analysisId: analysisResult.id,
          analysisDate: allMetrics.analysisInfo.analysisDate,
          qualityGate: allMetrics.analysisInfo.qualityGateStatus,
          metrics: {
            quality: {
              bugs: allMetrics.qualityMetrics.bugs,
              codeSmells: allMetrics.qualityMetrics.codeSmells,
              maintainabilityRating:
                allMetrics.qualityMetrics.maintainabilityRating,
              technicalDebtMinutes:
                allMetrics.qualityMetrics.technicalDebtMinutes,
            },
            security: {
              vulnerabilities: allMetrics.securityMetrics.vulnerabilities,
              securityHotspots: allMetrics.securityMetrics.securityHotspots,
              securityRating: allMetrics.securityMetrics.securityRating,
            },
            tests: {
              coverage: allMetrics.testMetrics.coverage,
              lineCoverage: allMetrics.testMetrics.lineCoverage,
              tests: allMetrics.testMetrics.tests,
            },
          },
        },
      });
    } catch (error) {
      logger.error("Error al sincronizar métricas de SonarQube:", error);
      next(error);
    }
  }

  /**
   * Obtiene las métricas más recientes de un proyecto
   * GET /api/sonar/metrics/:projectCode
   */
  static async getLatestMetrics(req, res, next) {
    try {
      const { projectCode } = req.params;

      const metrics = await sonarDB.getLatestMetrics(projectCode);
      if (!metrics) {
        return res.status(404).json({
          success: false,
          error: "No se encontraron métricas para el proyecto especificado",
        });
      }

      res.json({
        success: true,
        data: {
          project: {
            code: metrics.codigo,
            name: metrics.nombre,
            sonarProjectKey: metrics.sonar_project_key,
          },
          lastAnalysis: metrics.analysis_date,
          qualityGate: metrics.quality_gate_status,
          quality: {
            bugs: metrics.bugs,
            codeSmells: metrics.code_smells,
            technicalDebtMinutes: metrics.technical_debt_minutes,
            maintainabilityRating: metrics.maintainability_rating,
            duplicatedLinesDensity: metrics.duplicated_lines_density,
            complexity: metrics.complexity,
          },
          security: {
            vulnerabilities: metrics.vulnerabilities,
            securityHotspots: metrics.security_hotspots,
            securityRating: metrics.security_rating,
          },
          tests: {
            coverage: metrics.coverage,
            lineCoverage: metrics.line_coverage,
            branchCoverage: metrics.branch_coverage,
            tests: metrics.tests,
          },
        },
      });
    } catch (error) {
      logger.error("Error al obtener métricas de SonarQube:", error);
      next(error);
    }
  }

  /**
   * Obtiene el histórico de métricas de un proyecto
   * GET /api/sonar/history/:projectCode
   */
  static async getMetricsHistory(req, res, next) {
    try {
      const { projectCode } = req.params;
      const { limit = 10 } = req.query;

      const history = await sonarDB.getMetricsHistory(
        projectCode,
        parseInt(limit)
      );

      const formattedHistory = history.map((record) => ({
        analysisDate: record.analysis_date,
        version: record.project_version,
        qualityGate: record.quality_gate_status,
        quality: {
          bugs: record.bugs,
          codeSmells: record.code_smells,
          technicalDebtMinutes: record.technical_debt_minutes,
          maintainabilityRating: record.maintainability_rating,
        },
        security: {
          vulnerabilities: record.vulnerabilities,
          securityHotspots: record.security_hotspots,
          securityRating: record.security_rating,
        },
        tests: {
          coverage: record.coverage,
          lineCoverage: record.line_coverage,
          branchCoverage: record.branch_coverage,
        },
      }));

      res.json({
        success: true,
        data: {
          projectCode,
          totalRecords: history.length,
          history: formattedHistory,
        },
      });
    } catch (error) {
      logger.error("Error al obtener histórico de métricas:", error);
      next(error);
    }
  }

  /**
   * Verifica la conectividad con SonarQube
   * GET /api/sonar/status
   */
  static async checkSonarStatus(req, res, next) {
    try {
      const { projectCode = "default" } = req.query;
      const config = SonarQubeController.getSonarConfig(projectCode);
      const sonarService = new SonarQubeService(config.serverUrl, config.token);

      const status = await sonarService.testConnection();

      res.json({
        success: true,
        data: {
          serverUrl: config.serverUrl,
          connected: status.connected,
          status: status.status || null,
          version: status.version || null,
          error: status.error || null,
        },
      });
    } catch (error) {
      logger.error("Error al verificar estado de SonarQube:", error);
      next(error);
    }
  }

  /**
   * Obtiene métricas de calidad específicas
   * GET /api/sonar/quality/:projectCode
   */
  static async getQualityMetrics(req, res, next) {
    try {
      const { projectCode } = req.params;
      const config = SonarQubeController.getSonarConfig(projectCode);
      const sonarService = new SonarQubeService(config.serverUrl, config.token);

      const metrics = await sonarService.getQualityMetrics(config.projectKey);

      res.json({
        success: true,
        data: {
          projectCode,
          analysisDate: metrics.analysisDate,
          quality: metrics,
        },
      });
    } catch (error) {
      logger.error("Error al obtener métricas de calidad:", error);
      next(error);
    }
  }

  /**
   * Obtiene métricas de seguridad específicas
   * GET /api/sonar/security/:projectCode
   */
  static async getSecurityMetrics(req, res, next) {
    try {
      const { projectCode } = req.params;
      const config = SonarQubeController.getSonarConfig(projectCode);
      const sonarService = new SonarQubeService(config.serverUrl, config.token);

      const metrics = await sonarService.getSecurityMetrics(config.projectKey);

      res.json({
        success: true,
        data: {
          projectCode,
          analysisDate: metrics.analysisDate,
          security: metrics,
        },
      });
    } catch (error) {
      logger.error("Error al obtener métricas de seguridad:", error);
      next(error);
    }
  }

  /**
   * Obtiene métricas de pruebas específicas
   * GET /api/sonar/tests/:projectCode
   */
  static async getTestMetrics(req, res, next) {
    try {
      const { projectCode } = req.params;
      const config = SonarQubeController.getSonarConfig(projectCode);
      const sonarService = new SonarQubeService(config.serverUrl, config.token);

      const metrics = await sonarService.getTestMetrics(config.projectKey);

      res.json({
        success: true,
        data: {
          projectCode,
          analysisDate: metrics.analysisDate,
          tests: metrics,
        },
      });
    } catch (error) {
      logger.error("Error al obtener métricas de pruebas:", error);
      next(error);
    }
  }

  /**
   * Sincroniza métricas de todos los proyectos
   * POST /api/sonar/sync-all
   */
  static async syncAllProjects(req, res, next) {
    try {
      const projectCodes = ["PROJ-2025-001", "PROJ-2025-002", "PROJ-2025-003"];
      const results = [];
      const errors = [];

      for (const projectCode of projectCodes) {
        try {
          logger.info(`Sincronizando proyecto: ${projectCode}`);

          const config = SonarQubeController.getSonarConfig(projectCode);
          const sonarService = new SonarQubeService(
            config.serverUrl,
            config.token
          );

          // Verificar si el proyecto existe en SonarQube
          const projectInfo = await sonarService.getProjectInfo(
            config.projectKey
          );
          if (!projectInfo) {
            logger.warn(
              `Proyecto ${config.projectKey} no encontrado en SonarQube`
            );
            continue;
          }

          // Actualizar/crear proyecto en BD
          await sonarDB.upsertProject({
            codigo: projectCode,
            nombre: projectInfo.name,
            sonarProjectKey: config.projectKey,
            sonarServerUrl: config.serverUrl,
          });

          results.push({
            projectCode,
            status: "success",
            message: "Proyecto preparado para sincronización",
          });
        } catch (error) {
          logger.error(`Error sincronizando proyecto ${projectCode}:`, error);
          errors.push({
            projectCode,
            error: error.message,
          });
        }
      }

      res.json({
        success: true,
        message: `Sincronización completada. ${results.length} proyectos procesados.`,
        data: {
          successful: results,
          errors: errors,
        },
      });
    } catch (error) {
      logger.error("Error al sincronizar todos los proyectos:", error);
      next(error);
    }
  }
}

module.exports = SonarQubeController;
