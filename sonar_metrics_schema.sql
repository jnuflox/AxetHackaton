-- Esquema de base de datos SQLite para métricas de SonarQube
-- Sistema de Gestión Integral de Proyectos

-- Tabla principal de proyectos (referencia)
CREATE TABLE IF NOT EXISTS proyectos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    sonar_project_key VARCHAR(255),
    sonar_server_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para métricas de calidad y mantenibilidad
CREATE TABLE IF NOT EXISTS sonar_quality_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    analysis_date DATETIME NOT NULL,
    
    -- Métricas de Calidad de Código
    bugs INTEGER DEFAULT 0,
    code_smells INTEGER DEFAULT 0,
    duplicated_lines_density DECIMAL(5,2) DEFAULT 0.0,
    lines_of_code INTEGER DEFAULT 0,
    
    -- Métricas de Mantenibilidad
    technical_debt_minutes INTEGER DEFAULT 0, -- en minutos
    technical_debt_ratio DECIMAL(5,2) DEFAULT 0.0,
    maintainability_rating VARCHAR(2), -- A, B, C, D, E
    complexity INTEGER DEFAULT 0,
    cognitive_complexity INTEGER DEFAULT 0,
    
    -- Métricas de Duplicación
    duplicated_blocks INTEGER DEFAULT 0,
    duplicated_files INTEGER DEFAULT 0,
    duplicated_lines INTEGER DEFAULT 0,
    
    -- Métricas adicionales
    ncloc_language_distribution TEXT, -- JSON con distribución por lenguaje
    sqale_index INTEGER DEFAULT 0, -- SQALE Index (Deuda técnica)
    sqale_rating VARCHAR(2), -- A, B, C, D, E
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
);

-- Tabla para métricas de seguridad
CREATE TABLE IF NOT EXISTS sonar_security_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    analysis_date DATETIME NOT NULL,
    
    -- Vulnerabilidades
    vulnerabilities INTEGER DEFAULT 0,
    security_hotspots INTEGER DEFAULT 0,
    security_rating VARCHAR(2), -- A, B, C, D, E
    
    -- Desglose por severidad de vulnerabilidades
    vulnerabilities_blocker INTEGER DEFAULT 0,
    vulnerabilities_critical INTEGER DEFAULT 0,
    vulnerabilities_major INTEGER DEFAULT 0,
    vulnerabilities_minor INTEGER DEFAULT 0,
    vulnerabilities_info INTEGER DEFAULT 0,
    
    -- Hotspots de seguridad por categoría
    security_hotspots_reviewed INTEGER DEFAULT 0,
    security_hotspots_to_review INTEGER DEFAULT 0,
    security_review_rating VARCHAR(2), -- A, B, C, D, E
    
    -- Métricas específicas de seguridad
    security_remediation_effort INTEGER DEFAULT 0, -- en minutos
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
);

-- Tabla para métricas de pruebas y cobertura
CREATE TABLE IF NOT EXISTS sonar_test_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    analysis_date DATETIME NOT NULL,
    
    -- Cobertura general
    coverage DECIMAL(5,2) DEFAULT 0.0,
    line_coverage DECIMAL(5,2) DEFAULT 0.0,
    branch_coverage DECIMAL(5,2) DEFAULT 0.0,
    
    -- Líneas de cobertura
    lines_to_cover INTEGER DEFAULT 0,
    uncovered_lines INTEGER DEFAULT 0,
    
    -- Condiciones de cobertura
    conditions_to_cover INTEGER DEFAULT 0,
    uncovered_conditions INTEGER DEFAULT 0,
    
    -- Pruebas unitarias
    tests INTEGER DEFAULT 0,
    test_success_density DECIMAL(5,2) DEFAULT 0.0,
    test_errors INTEGER DEFAULT 0,
    test_failures INTEGER DEFAULT 0,
    skipped_tests INTEGER DEFAULT 0,
    test_execution_time INTEGER DEFAULT 0, -- en milisegundos
    
    -- Cobertura por tipo
    coverage_line_hits_data TEXT, -- Datos detallados de hits por línea
    covered_conditions_by_line TEXT, -- Condiciones cubiertas por línea
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE
);

-- Tabla para histórico de análisis de SonarQube
CREATE TABLE IF NOT EXISTS sonar_analysis_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    proyecto_id INTEGER NOT NULL,
    analysis_key VARCHAR(255) UNIQUE NOT NULL,
    analysis_date DATETIME NOT NULL,
    revision VARCHAR(255),
    project_version VARCHAR(50),
    
    -- Estado del análisis
    status VARCHAR(20) DEFAULT 'SUCCESS', -- SUCCESS, FAILED, CANCELLED
    
    -- Métricas generales del análisis
    quality_gate_status VARCHAR(10), -- OK, ERROR, WARN
    quality_gate_details TEXT, -- JSON con detalles del Quality Gate
    
    -- Referencias a métricas detalladas
    quality_metrics_id INTEGER,
    security_metrics_id INTEGER,
    test_metrics_id INTEGER,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,
    FOREIGN KEY (quality_metrics_id) REFERENCES sonar_quality_metrics(id),
    FOREIGN KEY (security_metrics_id) REFERENCES sonar_security_metrics(id),
    FOREIGN KEY (test_metrics_id) REFERENCES sonar_test_metrics(id)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_quality_metrics_proyecto_date 
    ON sonar_quality_metrics(proyecto_id, analysis_date DESC);

CREATE INDEX IF NOT EXISTS idx_security_metrics_proyecto_date 
    ON sonar_security_metrics(proyecto_id, analysis_date DESC);

CREATE INDEX IF NOT EXISTS idx_test_metrics_proyecto_date 
    ON sonar_test_metrics(proyecto_id, analysis_date DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_history_proyecto_date 
    ON sonar_analysis_history(proyecto_id, analysis_date DESC);

CREATE INDEX IF NOT EXISTS idx_proyectos_sonar_key 
    ON proyectos(sonar_project_key);

-- Vista para obtener las métricas más recientes de un proyecto
CREATE VIEW IF NOT EXISTS latest_sonar_metrics AS
SELECT 
    p.id as proyecto_id,
    p.codigo,
    p.nombre,
    p.sonar_project_key,
    
    -- Última calidad
    qm.bugs,
    qm.code_smells,
    qm.technical_debt_minutes,
    qm.maintainability_rating,
    qm.duplicated_lines_density,
    qm.complexity,
    
    -- Última seguridad
    sm.vulnerabilities,
    sm.security_hotspots,
    sm.security_rating,
    
    -- Últimas pruebas
    tm.coverage,
    tm.line_coverage,
    tm.branch_coverage,
    tm.tests,
    
    -- Último análisis
    ah.analysis_date,
    ah.quality_gate_status,
    ah.project_version
    
FROM proyectos p
LEFT JOIN sonar_analysis_history ah ON ah.proyecto_id = p.id 
    AND ah.analysis_date = (
        SELECT MAX(analysis_date) 
        FROM sonar_analysis_history 
        WHERE proyecto_id = p.id
    )
LEFT JOIN sonar_quality_metrics qm ON qm.id = ah.quality_metrics_id
LEFT JOIN sonar_security_metrics sm ON sm.id = ah.security_metrics_id
LEFT JOIN sonar_test_metrics tm ON tm.id = ah.test_metrics_id;

-- Trigger para actualizar timestamp en proyectos
CREATE TRIGGER IF NOT EXISTS update_proyectos_timestamp 
    AFTER UPDATE ON proyectos
    FOR EACH ROW
BEGIN
    UPDATE proyectos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;