const axios = require("axios");

class SonarQubeService {
  constructor(serverUrl, token = null) {
    this.serverUrl = serverUrl.endsWith("/")
      ? serverUrl.slice(0, -1)
      : serverUrl;
    this.token = token;
    this.client = axios.create({
      baseURL: `${this.serverUrl}/api`,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Configurar autenticación si se proporciona token
    if (this.token) {
      this.client.defaults.auth = {
        username: this.token,
        password: "", // SonarQube usa el token como username y password vacío
      };
    }
  }

  /**
   * Obtiene información básica del proyecto
   */
  async getProjectInfo(projectKey) {
    try {
      const response = await this.client.get("/projects/search", {
        params: { projects: projectKey },
      });

      const projects = response.data.components || [];
      return projects.find((project) => project.key === projectKey) || null;
    } catch (error) {
      throw this.handleError(
        "Error al obtener información del proyecto",
        error
      );
    }
  }

  /**
   * Obtiene métricas específicas de un proyecto
   */
  async getProjectMetrics(projectKey, metricKeys) {
    try {
      const response = await this.client.get("/measures/component", {
        params: {
          component: projectKey,
          metricKeys: metricKeys.join(","),
        },
      });

      return this.parseMetrics(response.data.component.measures || []);
    } catch (error) {
      throw this.handleError("Error al obtener métricas del proyecto", error);
    }
  }

  /**
   * Obtiene métricas de calidad y mantenibilidad
   */
  async getQualityMetrics(projectKey) {
    const qualityMetricKeys = [
      "bugs",
      "code_smells",
      "duplicated_lines_density",
      "ncloc", // Lines of Code
      "technical_debt",
      "sqale_debt_ratio",
      "maintainability_rating",
      "complexity",
      "cognitive_complexity",
      "duplicated_blocks",
      "duplicated_files",
      "duplicated_lines",
      "ncloc_language_distribution",
      "sqale_index",
      "sqale_rating",
    ];

    const metrics = await this.getProjectMetrics(projectKey, qualityMetricKeys);

    return {
      analysisDate: new Date(),
      bugs: parseInt(metrics.bugs || 0),
      codeSmells: parseInt(metrics.code_smells || 0),
      duplicatedLinesDensity: parseFloat(metrics.duplicated_lines_density || 0),
      linesOfCode: parseInt(metrics.ncloc || 0),
      technicalDebtMinutes: this.parseTechnicalDebt(
        metrics.technical_debt || "0min"
      ),
      technicalDebtRatio: parseFloat(metrics.sqale_debt_ratio || 0),
      maintainabilityRating: metrics.maintainability_rating || "E",
      complexity: parseInt(metrics.complexity || 0),
      cognitiveComplexity: parseInt(metrics.cognitive_complexity || 0),
      duplicatedBlocks: parseInt(metrics.duplicated_blocks || 0),
      duplicatedFiles: parseInt(metrics.duplicated_files || 0),
      duplicatedLines: parseInt(metrics.duplicated_lines || 0),
      nclocLanguageDistribution: metrics.ncloc_language_distribution || "{}",
      sqaleIndex: parseInt(metrics.sqale_index || 0),
      sqaleRating: metrics.sqale_rating || "E",
    };
  }

  /**
   * Obtiene métricas de seguridad
   */
  async getSecurityMetrics(projectKey) {
    const securityMetricKeys = [
      "vulnerabilities",
      "security_hotspots",
      "security_rating",
      "security_remediation_effort",
      "security_review_rating",
      "security_hotspots_reviewed",
      "security_hotspots_to_review",
    ];

    const metrics = await this.getProjectMetrics(
      projectKey,
      securityMetricKeys
    );

    // Obtener desglose de vulnerabilidades por severidad
    const vulnerabilityDetails = await this.getVulnerabilityBySeverity(
      projectKey
    );

    return {
      analysisDate: new Date(),
      vulnerabilities: parseInt(metrics.vulnerabilities || 0),
      securityHotspots: parseInt(metrics.security_hotspots || 0),
      securityRating: metrics.security_rating || "E",
      securityRemediationEffort: this.parseTechnicalDebt(
        metrics.security_remediation_effort || "0min"
      ),
      securityReviewRating: metrics.security_review_rating || "E",
      securityHotspotsReviewed: parseInt(
        metrics.security_hotspots_reviewed || 0
      ),
      securityHotspotsToReview: parseInt(
        metrics.security_hotspots_to_review || 0
      ),
      ...vulnerabilityDetails,
    };
  }

  /**
   * Obtiene métricas de pruebas y cobertura
   */
  async getTestMetrics(projectKey) {
    const testMetricKeys = [
      "coverage",
      "line_coverage",
      "branch_coverage",
      "lines_to_cover",
      "uncovered_lines",
      "conditions_to_cover",
      "uncovered_conditions",
      "tests",
      "test_success_density",
      "test_errors",
      "test_failures",
      "skipped_tests",
      "test_execution_time",
    ];

    const metrics = await this.getProjectMetrics(projectKey, testMetricKeys);

    return {
      analysisDate: new Date(),
      coverage: parseFloat(metrics.coverage || 0),
      lineCoverage: parseFloat(metrics.line_coverage || 0),
      branchCoverage: parseFloat(metrics.branch_coverage || 0),
      linesToCover: parseInt(metrics.lines_to_cover || 0),
      uncoveredLines: parseInt(metrics.uncovered_lines || 0),
      conditionsToCover: parseInt(metrics.conditions_to_cover || 0),
      uncoveredConditions: parseInt(metrics.uncovered_conditions || 0),
      tests: parseInt(metrics.tests || 0),
      testSuccessDensity: parseFloat(metrics.test_success_density || 0),
      testErrors: parseInt(metrics.test_errors || 0),
      testFailures: parseInt(metrics.test_failures || 0),
      skippedTests: parseInt(metrics.skipped_tests || 0),
      testExecutionTime: parseInt(metrics.test_execution_time || 0),
    };
  }

  /**
   * Obtiene información del último análisis
   */
  async getLatestAnalysis(projectKey) {
    try {
      const response = await this.client.get("/project_analyses/search", {
        params: {
          project: projectKey,
          ps: 1, // Solo el más reciente
        },
      });

      const analyses = response.data.analyses || [];
      if (analyses.length === 0) {
        return null;
      }

      const latestAnalysis = analyses[0];

      // Obtener información del Quality Gate
      const qualityGate = await this.getQualityGateStatus(projectKey);

      return {
        analysisKey: latestAnalysis.key,
        analysisDate: new Date(latestAnalysis.date),
        revision: latestAnalysis.revision || null,
        projectVersion: latestAnalysis.projectVersion || null,
        status: "SUCCESS",
        qualityGateStatus: qualityGate.status,
        qualityGateDetails: qualityGate.conditions || [],
      };
    } catch (error) {
      throw this.handleError("Error al obtener el último análisis", error);
    }
  }

  /**
   * Obtiene el estado del Quality Gate
   */
  async getQualityGateStatus(projectKey) {
    try {
      const response = await this.client.get("/qualitygates/project_status", {
        params: { projectKey },
      });

      return {
        status: response.data.projectStatus.status || "ERROR",
        conditions: response.data.projectStatus.conditions || [],
      };
    } catch (error) {
      console.warn(
        "No se pudo obtener el estado del Quality Gate:",
        error.message
      );
      return { status: "NONE", conditions: [] };
    }
  }

  /**
   * Obtiene vulnerabilidades por severidad
   */
  async getVulnerabilityBySeverity(projectKey) {
    try {
      const severities = ["BLOCKER", "CRITICAL", "MAJOR", "MINOR", "INFO"];
      const result = {};

      for (const severity of severities) {
        try {
          const response = await this.client.get("/issues/search", {
            params: {
              componentKeys: projectKey,
              types: "VULNERABILITY",
              severities: severity,
              ps: 1,
              facets: "severities",
            },
          });

          result[
            `vulnerabilities${
              severity.charAt(0) + severity.slice(1).toLowerCase()
            }`
          ] = response.data.total || 0;
        } catch (err) {
          result[
            `vulnerabilities${
              severity.charAt(0) + severity.slice(1).toLowerCase()
            }`
          ] = 0;
        }
      }

      return result;
    } catch (error) {
      console.warn(
        "No se pudo obtener vulnerabilidades por severidad:",
        error.message
      );
      return {
        vulnerabilitiesBlocker: 0,
        vulnerabilitiesCritical: 0,
        vulnerabilitiesMajor: 0,
        vulnerabilitiesMinor: 0,
        vulnerabilitiesInfo: 0,
      };
    }
  }

  /**
   * Obtiene todas las métricas de un proyecto
   */
  async getAllMetrics(projectKey) {
    try {
      const [
        projectInfo,
        qualityMetrics,
        securityMetrics,
        testMetrics,
        analysisInfo,
      ] = await Promise.all([
        this.getProjectInfo(projectKey),
        this.getQualityMetrics(projectKey),
        this.getSecurityMetrics(projectKey),
        this.getTestMetrics(projectKey),
        this.getLatestAnalysis(projectKey),
      ]);

      return {
        projectInfo,
        qualityMetrics,
        securityMetrics,
        testMetrics,
        analysisInfo,
      };
    } catch (error) {
      throw this.handleError("Error al obtener todas las métricas", error);
    }
  }

  /**
   * Parsea métricas del formato de SonarQube
   */
  parseMetrics(measures) {
    const metrics = {};
    measures.forEach((measure) => {
      metrics[measure.metric] = measure.value || null;
    });
    return metrics;
  }

  /**
   * Convierte tiempo de deuda técnica a minutos
   */
  parseTechnicalDebt(timeString) {
    if (!timeString || timeString === "0min") return 0;

    const timeValue = parseFloat(timeString);
    if (timeString.includes("h")) {
      return timeValue * 60; // Convertir horas a minutos
    } else if (timeString.includes("d")) {
      return timeValue * 60 * 8; // Convertir días a minutos (8h/día)
    } else {
      return timeValue; // Ya en minutos
    }
  }

  /**
   * Maneja errores de la API
   */
  handleError(message, error) {
    console.error(`${message}:`, error.message);

    if (error.response) {
      const status = error.response.status;
      const statusText = error.response.statusText;
      const data = error.response.data;

      return new Error(
        `${message} - HTTP ${status} ${statusText}: ${JSON.stringify(data)}`
      );
    } else if (error.request) {
      return new Error(`${message} - No se pudo conectar con SonarQube`);
    } else {
      return new Error(`${message} - ${error.message}`);
    }
  }

  /**
   * Verifica la conectividad con SonarQube
   */
  async testConnection() {
    try {
      const response = await this.client.get("/system/status");
      return {
        connected: true,
        status: response.data.status,
        version: response.data.version,
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
      };
    }
  }
}

module.exports = SonarQubeService;
