# SonarQube API Integration

Este módulo proporciona integración completa con SonarQube para extraer y almacenar métricas de calidad, seguridad y pruebas.

## 🏗️ Arquitectura

- **SQLite Database**: Almacenamiento local de métricas históricas
- **SonarQube API Service**: Conexión con servidor SonarQube
- **REST API Endpoints**: Exposición de métricas y sincronización
- **Automatic Schema**: Creación automática de tablas y índices

## 📊 Métricas Soportadas

### Calidad y Mantenibilidad

- Bugs detectados
- Code Smells
- Deuda técnica (en minutos)
- Rating de mantenibilidad (A-E)
- Densidad de líneas duplicadas
- Complejidad ciclomática y cognitiva
- SQALE Index y Rating

### Seguridad

- Vulnerabilidades por severidad
- Security Hotspots
- Security Rating (A-E)
- Esfuerzo de remediación de seguridad
- Hotspots revisados vs pendientes

### Pruebas y Cobertura

- Cobertura general, de líneas y ramas
- Número de pruebas ejecutadas
- Errores y fallos en pruebas
- Tiempo de ejecución de pruebas
- Líneas y condiciones cubiertas/descubiertas

## 🛠️ Configuración

### 1. Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

```bash
# SonarQube Server
SONAR_SERVER_URL=http://localhost:9000
SONAR_TOKEN=your-sonarqube-token

# SQLite Database
SQLITE_DB_PATH=./sonar_metrics.db
```

### 2. Generación de Token SonarQube

1. Acceder a SonarQube como administrador
2. Ir a: **Administration > Security > Users**
3. Buscar tu usuario y hacer clic en tokens
4. Generar nuevo token y copiarlo a la variable `SONAR_TOKEN`

### 3. Configuración de Proyectos

En el controlador `sonarqube.controller.js`, actualizar la función `getSonarConfig()` con las claves de tus proyectos:

```javascript
const configs = {
  "PROJ-2025-001": {
    serverUrl: "http://localhost:9000",
    projectKey: "your-project-key-in-sonarqube",
    token: process.env.SONAR_TOKEN,
  },
};
```

## 🚀 Uso del API

### Endpoints Disponibles

#### Verificar Conectividad

```bash
GET /api/sonar/status?projectCode=PROJ-2025-001
```

#### Sincronizar Métricas

```bash
POST /api/sonar/sync/PROJ-2025-001
Content-Type: application/json

{
  "forceUpdate": false
}
```

#### Obtener Métricas Actuales

```bash
GET /api/sonar/metrics/PROJ-2025-001
```

#### Obtener Histórico

```bash
GET /api/sonar/history/PROJ-2025-001?limit=10
```

#### Métricas Específicas

```bash
GET /api/sonar/quality/PROJ-2025-001
GET /api/sonar/security/PROJ-2025-001
GET /api/sonar/tests/PROJ-2025-001
```

#### Sincronizar Todos los Proyectos

```bash
POST /api/sonar/sync-all
```

## 📈 Ejemplo de Respuesta

```json
{
  "success": true,
  "data": {
    "project": {
      "code": "PROJ-2025-001",
      "name": "Sistema Bancario",
      "sonarProjectKey": "sistema-gestion-bancaria"
    },
    "lastAnalysis": "2026-01-13T14:30:00.000Z",
    "qualityGate": "OK",
    "quality": {
      "bugs": 2,
      "codeSmells": 15,
      "technicalDebtMinutes": 120,
      "maintainabilityRating": "A",
      "duplicatedLinesDensity": 2.5,
      "complexity": 245
    },
    "security": {
      "vulnerabilities": 1,
      "securityHotspots": 3,
      "securityRating": "B"
    },
    "tests": {
      "coverage": 85.2,
      "lineCoverage": 87.1,
      "branchCoverage": 82.4,
      "tests": 156
    }
  }
}
```

## 🗄️ Estructura de Base de Datos

### Tablas Principales

- **proyectos**: Información de proyectos
- **sonar_quality_metrics**: Métricas de calidad y mantenibilidad
- **sonar_security_metrics**: Métricas de seguridad
- **sonar_test_metrics**: Métricas de pruebas y cobertura
- **sonar_analysis_history**: Histórico de análisis

### Vista de Consulta

- **latest_sonar_metrics**: Vista con las métricas más recientes de cada proyecto

## 🔍 Casos de Uso

### 1. Sincronización Manual

```javascript
// Sincronizar métricas de un proyecto específico
const response = await fetch("/api/sonar/sync/PROJ-2025-001", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ forceUpdate: true }),
});
```

### 2. Dashboard en Tiempo Real

```javascript
// Obtener métricas para mostrar en dashboard
const metrics = await fetch("/api/sonar/metrics/PROJ-2025-001");
const data = await metrics.json();

// Usar data.quality, data.security, data.tests para gráficos
```

### 3. Análisis de Tendencias

```javascript
// Obtener histórico para análisis de tendencias
const history = await fetch("/api/sonar/history/PROJ-2025-001?limit=30");
const trends = await history.json();

// Analizar evolución de métricas en el tiempo
```

## 🔧 Troubleshooting

### Error de Conexión a SonarQube

- Verificar que `SONAR_SERVER_URL` sea accesible
- Comprobar que el token tenga permisos de lectura
- Usar `/api/sonar/status` para diagnosticar

### Proyecto No Encontrado

- Verificar que `projectKey` existe en SonarQube
- Comprobar que el proyecto tenga al menos un análisis
- Revisar configuración en `getSonarConfig()`

### Error de Base de Datos

- Verificar permisos de escritura en directorio
- Comprobar que el archivo `sonar_metrics_schema.sql` existe
- Revisar logs del servidor para detalles específicos

## 📝 Logging

El módulo registra actividades importantes:

```
[INFO] Iniciando sincronización de métricas SonarQube para proyecto: PROJ-2025-001
[INFO] Métricas sincronizadas exitosamente para proyecto: PROJ-2025-001
[ERROR] Error al conectar con SonarQube: Connection refused
```

## 🚦 Automatización

### Cron Job para Sincronización

```bash
# Sincronizar métricas cada 6 horas
0 */6 * * * curl -X POST http://localhost:3000/api/sonar/sync-all
```

### Integración con CI/CD

```yaml
# En pipeline de CI/CD
- name: Update SonarQube Metrics
  run: |
    curl -X POST http://api-server/api/sonar/sync/\${PROJECT_CODE} \
         -H "Content-Type: application/json"
```
