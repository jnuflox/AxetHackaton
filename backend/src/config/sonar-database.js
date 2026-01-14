const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

class SonarDatabase {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, "../../../sonar_metrics.db");
    this.schemaPath = path.join(__dirname, "../../../sonar_metrics_schema.sql");
  }

  /**
   * Inicializa la conexión a la base de datos SQLite
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error("Error al conectar con SQLite:", err.message);
          reject(err);
        } else {
          console.log(
            "Conectado a la base de datos SQLite de SonarQube métricas"
          );
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  /**
   * Crea las tablas usando el esquema SQL
   */
  async createTables() {
    return new Promise((resolve, reject) => {
      // Leer el archivo de esquema
      fs.readFile(this.schemaPath, "utf8", (err, schema) => {
        if (err) {
          console.error("Error al leer el esquema:", err.message);
          reject(err);
          return;
        }

        // Ejecutar el esquema SQL
        this.db.exec(schema, (err) => {
          if (err) {
            console.error("Error al crear las tablas:", err.message);
            reject(err);
          } else {
            console.log("Tablas de SonarQube creadas exitosamente");
            resolve();
          }
        });
      });
    });
  }

  /**
   * Ejecuta una consulta SQL
   */
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Ejecuta una consulta SELECT
   */
  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Ejecuta una consulta SELECT que retorna múltiples filas
   */
  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Cierra la conexión a la base de datos
   */
  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log("Conexión a SQLite cerrada");
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Inserta o actualiza un proyecto
   */
  async upsertProject(projectData) {
    const { codigo, nombre, sonarProjectKey, sonarServerUrl } = projectData;

    const sql = `
            INSERT INTO proyectos (codigo, nombre, sonar_project_key, sonar_server_url)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(codigo) DO UPDATE SET
                nombre = excluded.nombre,
                sonar_project_key = excluded.sonar_project_key,
                sonar_server_url = excluded.sonar_server_url,
                updated_at = CURRENT_TIMESTAMP
        `;

    return this.run(sql, [codigo, nombre, sonarProjectKey, sonarServerUrl]);
  }

  /**
   * Obtiene un proyecto por su código
   */
  async getProjectByCode(codigo) {
    const sql = "SELECT * FROM proyectos WHERE codigo = ?";
    return this.get(sql, [codigo]);
  }

  /**
   * Inserta métricas de calidad
   */
  async insertQualityMetrics(projectId, metrics) {
    const sql = `
            INSERT INTO sonar_quality_metrics (
                proyecto_id, analysis_date, bugs, code_smells, duplicated_lines_density,
                lines_of_code, technical_debt_minutes, technical_debt_ratio,
                maintainability_rating, complexity, cognitive_complexity,
                duplicated_blocks, duplicated_files, duplicated_lines,
                ncloc_language_distribution, sqale_index, sqale_rating
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const params = [
      projectId,
      metrics.analysisDate,
      metrics.bugs || 0,
      metrics.codeSmells || 0,
      metrics.duplicatedLinesDensity || 0,
      metrics.linesOfCode || 0,
      metrics.technicalDebtMinutes || 0,
      metrics.technicalDebtRatio || 0,
      metrics.maintainabilityRating,
      metrics.complexity || 0,
      metrics.cognitiveComplexity || 0,
      metrics.duplicatedBlocks || 0,
      metrics.duplicatedFiles || 0,
      metrics.duplicatedLines || 0,
      metrics.nclocLanguageDistribution || "{}",
      metrics.sqaleIndex || 0,
      metrics.sqaleRating,
    ];

    return this.run(sql, params);
  }

  /**
   * Inserta métricas de seguridad
   */
  async insertSecurityMetrics(projectId, metrics) {
    const sql = `
            INSERT INTO sonar_security_metrics (
                proyecto_id, analysis_date, vulnerabilities, security_hotspots,
                security_rating, vulnerabilities_blocker, vulnerabilities_critical,
                vulnerabilities_major, vulnerabilities_minor, vulnerabilities_info,
                security_hotspots_reviewed, security_hotspots_to_review,
                security_review_rating, security_remediation_effort
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const params = [
      projectId,
      metrics.analysisDate,
      metrics.vulnerabilities || 0,
      metrics.securityHotspots || 0,
      metrics.securityRating,
      metrics.vulnerabilitiesBlocker || 0,
      metrics.vulnerabilitiesCritical || 0,
      metrics.vulnerabilitiesMajor || 0,
      metrics.vulnerabilitiesMinor || 0,
      metrics.vulnerabilitiesInfo || 0,
      metrics.securityHotspotsReviewed || 0,
      metrics.securityHotspotsToReview || 0,
      metrics.securityReviewRating,
      metrics.securityRemediationEffort || 0,
    ];

    return this.run(sql, params);
  }

  /**
   * Inserta métricas de pruebas
   */
  async insertTestMetrics(projectId, metrics) {
    const sql = `
            INSERT INTO sonar_test_metrics (
                proyecto_id, analysis_date, coverage, line_coverage, branch_coverage,
                lines_to_cover, uncovered_lines, conditions_to_cover,
                uncovered_conditions, tests, test_success_density,
                test_errors, test_failures, skipped_tests, test_execution_time,
                coverage_line_hits_data, covered_conditions_by_line
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const params = [
      projectId,
      metrics.analysisDate,
      metrics.coverage || 0,
      metrics.lineCoverage || 0,
      metrics.branchCoverage || 0,
      metrics.linesToCover || 0,
      metrics.uncoveredLines || 0,
      metrics.conditionsToCover || 0,
      metrics.uncoveredConditions || 0,
      metrics.tests || 0,
      metrics.testSuccessDensity || 0,
      metrics.testErrors || 0,
      metrics.testFailures || 0,
      metrics.skippedTests || 0,
      metrics.testExecutionTime || 0,
      metrics.coverageLineHitsData || "{}",
      metrics.coveredConditionsByLine || "{}",
    ];

    return this.run(sql, params);
  }

  /**
   * Inserta registro de análisis
   */
  async insertAnalysisHistory(projectId, analysisData, metricIds) {
    const sql = `
            INSERT INTO sonar_analysis_history (
                proyecto_id, analysis_key, analysis_date, revision,
                project_version, status, quality_gate_status,
                quality_gate_details, quality_metrics_id,
                security_metrics_id, test_metrics_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const params = [
      projectId,
      analysisData.analysisKey,
      analysisData.analysisDate,
      analysisData.revision,
      analysisData.projectVersion,
      analysisData.status || "SUCCESS",
      analysisData.qualityGateStatus,
      JSON.stringify(analysisData.qualityGateDetails || {}),
      metricIds.qualityMetricsId,
      metricIds.securityMetricsId,
      metricIds.testMetricsId,
    ];

    return this.run(sql, params);
  }

  /**
   * Obtiene las métricas más recientes de un proyecto
   */
  async getLatestMetrics(projectCode) {
    const sql = "SELECT * FROM latest_sonar_metrics WHERE codigo = ?";
    return this.get(sql, [projectCode]);
  }

  /**
   * Obtiene el histórico de métricas de un proyecto
   */
  async getMetricsHistory(projectCode, limit = 10) {
    const sql = `
            SELECT 
                ah.*,
                qm.bugs, qm.code_smells, qm.technical_debt_minutes, qm.maintainability_rating,
                sm.vulnerabilities, sm.security_hotspots, sm.security_rating,
                tm.coverage, tm.line_coverage, tm.branch_coverage
            FROM sonar_analysis_history ah
            INNER JOIN proyectos p ON p.id = ah.proyecto_id
            LEFT JOIN sonar_quality_metrics qm ON qm.id = ah.quality_metrics_id
            LEFT JOIN sonar_security_metrics sm ON sm.id = ah.security_metrics_id
            LEFT JOIN sonar_test_metrics tm ON tm.id = ah.test_metrics_id
            WHERE p.codigo = ?
            ORDER BY ah.analysis_date DESC
            LIMIT ?
        `;

    return this.all(sql, [projectCode, limit]);
  }
}

// Instancia singleton
const sonarDB = new SonarDatabase();

module.exports = sonarDB;
