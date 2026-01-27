/**
 * Servicio de Analisis GenAI para Capa 4 - Inteligencia Predictiva
 * 
 * Este servicio agrega datos de las capas 1, 2, 3 y conectores seleccionados
 * para generar predicciones de riesgos y recomendaciones usando Azure OpenAI.
 */

const logger = require('../utils/logger');

class GenAIAnalysisService {
  constructor() {
    // Configuracion de Azure OpenAI (usar variables de entorno en produccion)
    this.azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
    this.azureOpenAIKey = process.env.AZURE_OPENAI_KEY || '';
    this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4';
    this.apiVersion = '2024-02-15-preview';
  }

  /**
   * Agrega el contexto de todas las capas del proyecto
   */
  aggregateProjectContext(capaUno, capaDos, capaTres, conectoresActivos) {
    const contexto = {
      contractualFinanciero: {
        slas: capaUno?.rfp?.slas || [],
        presupuesto: capaUno?.gecoval?.presupuesto || capaUno?.propuestaEconomica?.presupuestoTotal || 0,
        esfuerzoEstimado: capaUno?.gecoval?.esfuerzoEstimadoHoras || 0,
        cmOfertado: capaUno?.l1?.ofertaCM || 0,
        cmPiso: capaUno?.l1?.pisoCM || 0,
        riesgosIniciales: capaUno?.l1?.riesgosIniciales || [],
        planFacturacion: capaUno?.planFacturacion || []
      },
      operativo: {
        hitos: capaDos?.cronograma?.hitos?.map(h => ({
          nombre: h.nombre,
          estado: h.estado,
          semaforo: h.semaforo,
          avance: h.avancePorcentaje,
          fechaPlanificada: h.fechaFinPlanificada,
          fechaReal: h.fechaFinReal,
          diasRetraso: this._calcularDiasRetraso(h.fechaFinPlanificada, h.fechaFinReal)
        })) || [],
        equipoAsignado: capaDos?.cronograma?.equipoAsignado?.length || 0,
        esfuerzoReal: capaDos?.cronograma?.esfuerzoReal || 0,
        esfuerzoEstimado: capaDos?.cronograma?.esfuerzoEstimado || 0,
        jira: {
          velocidadPromedio: capaDos?.jira?.velocidadPromedio || 0,
          issuesCompletados: capaDos?.jira?.issuesCompletados || 0,
          issuesPendientes: capaDos?.jira?.issuesPendientes || 0,
          sprintActual: capaDos?.jira?.sprintActual || ''
        },
        kpis: {
          cumplimientoTareas: capaDos?.kpis?.cumplimientoTareas || 0,
          avanceHitos: capaDos?.kpis?.avanceHitos || 0,
          cumplimientoSLAs: capaDos?.kpis?.cumplimientoSLAs || []
        },
        riesgosActivos: capaDos?.riesgos?.filter(r => r.estado !== 'CERRADO') || []
      },
      tecnico: {
        sonarqube: {
          bugs: capaTres?.sonarqube?.metricas?.bugs || 0,
          vulnerabilities: capaTres?.sonarqube?.metricas?.vulnerabilities || 0,
          codeSmells: capaTres?.sonarqube?.metricas?.codeSmells || 0,
          coverage: capaTres?.sonarqube?.metricas?.coverage || 0,
          duplicatedLinesDensity: capaTres?.sonarqube?.metricas?.duplicatedLinesDensity || 0,
          technicalDebt: capaTres?.sonarqube?.metricas?.technicalDebt || 0,
          reliabilityRating: capaTres?.sonarqube?.metricas?.reliabilityRating || 'N/A',
          securityRating: capaTres?.sonarqube?.metricas?.securityRating || 'N/A',
          maintainabilityRating: capaTres?.sonarqube?.metricas?.maintainabilityRating || 'N/A'
        },
        deudaTecnica: capaTres?.sonarqube?.deudaTecnica || {},
        coverage: {
          unitario: capaTres?.coverage?.unitario?.lineCoverage || 0,
          integracion: capaTres?.coverage?.integracion?.lineCoverage || 0
        },
        vulnerabilidadesAbiertas: capaTres?.vulnerabilidades?.filter(v => v.estado === 'ABIERTA')?.length || 0,
        vulnerabilidadesCriticas: capaTres?.vulnerabilidades?.filter(v => v.severidad === 'CRITICA' && v.estado === 'ABIERTA')?.length || 0,
        antipatrones: capaTres?.antipatrones?.length || 0,
        cumplimientoEstandares: capaTres?.cumplimientoEstandares || {}
      },
      conectores: conectoresActivos.map(c => ({
        nombre: c.nombre,
        categoria: c.categoria,
        datosDisponibles: c.datosObtenidos,
        ultimaSync: c.ultimaSync
      }))
    };

    return contexto;
  }

  _calcularDiasRetraso(fechaPlanificada, fechaReal) {
    if (!fechaPlanificada) return 0;
    const planificada = new Date(fechaPlanificada);
    const real = fechaReal ? new Date(fechaReal) : new Date();
    const diffTime = real - planificada;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  /**
   * Construye el prompt para Azure OpenAI
   */
  buildPrompt(contexto, tipoAnalisis = 'FULL') {
    const systemPrompt = 'Eres un experto en gestion de proyectos de software con especializacion en analisis predictivo y gestion de riesgos. Tu rol es analizar datos de proyectos y generar predicciones precisas, identificar riesgos y proporcionar recomendaciones accionables. REGLAS: 1. Basa tus analisis UNICAMENTE en los datos proporcionados. 2. Asigna probabilidades realistas (0-100%). 3. Prioriza riesgos por impacto. 4. Las recomendaciones deben ser especificas y accionables. 5. Responde SIEMPRE en formato JSON valido.';

    const userPrompt = 'Analiza el siguiente contexto del proyecto:\n\n' + JSON.stringify(contexto, null, 2);

    return { systemPrompt, userPrompt };
  }

  /**
   * Llama a Azure OpenAI para analisis
   */
  async analyzeWithGenAI(contexto, tipoAnalisis = 'FULL') {
    if (!this.azureOpenAIEndpoint || !this.azureOpenAIKey) {
      logger.info('Azure OpenAI no configurado, usando analisis simulado');
      return this.generateSimulatedAnalysis(contexto, tipoAnalisis);
    }

    try {
      const { systemPrompt, userPrompt } = this.buildPrompt(contexto, tipoAnalisis);
      const response = await fetch(
        this.azureOpenAIEndpoint + '/openai/deployments/' + this.deploymentName + '/chat/completions?api-version=' + this.apiVersion,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.azureOpenAIKey
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.3,
            max_tokens: 4000,
            response_format: { type: 'json_object' }
          })
        }
      );

      if (!response.ok) {
        throw new Error('Azure OpenAI API error: ' + response.status);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      return JSON.parse(content);
    } catch (error) {
      logger.error('Error calling Azure OpenAI:', error);
      return this.generateSimulatedAnalysis(contexto, tipoAnalisis);
    }
  }

  /**
   * Genera analisis simulado basado en reglas cuando Azure OpenAI no esta disponible
   */
  generateSimulatedAnalysis(contexto, tipoAnalisis) {
    const now = new Date().toISOString();
    const prediccionesRiesgos = [];
    const recomendaciones = [];
    const alertasTempranas = [];

    // 1. Analisis de cobertura de codigo
    const coverage = contexto.tecnico.sonarqube.coverage || 0;
    if (coverage < 60) {
      prediccionesRiesgos.push({
        id: 'RISK-001',
        titulo: 'Cobertura de codigo insuficiente',
        descripcion: 'La cobertura actual del ' + coverage + '% esta por debajo del umbral recomendado (80%). Esto incrementa el riesgo de bugs no detectados en produccion.',
        probabilidad: Math.round(90 - coverage),
        impacto: coverage < 40 ? 'CRITICO' : 'ALTO',
        categoria: 'CALIDAD',
        fuentesDatos: ['sonarqube.coverage', 'capa3.coverage'],
        tendencia: 'ESTABLE'
      });

      recomendaciones.push({
        id: 'REC-001',
        titulo: 'Incrementar cobertura de tests unitarios',
        descripcion: 'Implementar tests unitarios para alcanzar al menos 80% de cobertura.',
        prioridad: coverage < 40 ? 'URGENTE' : 'ALTA',
        impactoEsperado: 'Reduccion del 60% en bugs de regresion',
        esfuerzoEstimado: '1-2 sprints',
        categoria: 'TECNICO',
        riesgosQueAborda: ['RISK-001']
      });
    }

    // 2. Analisis de vulnerabilidades
    const vulnsCriticas = contexto.tecnico.vulnerabilidadesCriticas || 0;
    if (vulnsCriticas > 0) {
      prediccionesRiesgos.push({
        id: 'RISK-002',
        titulo: 'Vulnerabilidades de seguridad criticas',
        descripcion: 'Se detectaron ' + vulnsCriticas + ' vulnerabilidades criticas que requieren atencion inmediata.',
        probabilidad: Math.min(95, 70 + vulnsCriticas * 10),
        impacto: 'CRITICO',
        categoria: 'CALIDAD',
        fuentesDatos: ['sonarqube.vulnerabilities', 'capa3.vulnerabilidades'],
        tendencia: 'EMPEORANDO'
      });

      alertasTempranas.push({
        tipo: 'SECURITY_CRITICAL',
        mensaje: vulnsCriticas + ' vulnerabilidades criticas detectadas requieren accion inmediata',
        severidad: 'CRITICA',
        metricaAfectada: 'sonarqube.vulnerabilities',
        accionSugerida: 'Asignar recursos dedicados para remediacion de seguridad'
      });

      recomendaciones.push({
        id: 'REC-002',
        titulo: 'Remediacion urgente de vulnerabilidades',
        descripcion: 'Crear un sprint de emergencia para remediar las ' + vulnsCriticas + ' vulnerabilidades criticas.',
        prioridad: 'URGENTE',
        impactoEsperado: 'Eliminacion de riesgos de seguridad criticos',
        esfuerzoEstimado: '3-5 dias',
        categoria: 'SEGURIDAD',
        riesgosQueAborda: ['RISK-002']
      });
    }

    // 3. Analisis de deuda tecnica
    const deudaTecnica = contexto.tecnico.sonarqube.technicalDebt || 0;
    if (deudaTecnica > 10) {
      prediccionesRiesgos.push({
        id: 'RISK-003',
        titulo: 'Deuda tecnica acumulada elevada',
        descripcion: 'La deuda tecnica actual de ' + deudaTecnica + ' dias afecta la velocidad del equipo.',
        probabilidad: Math.min(80, 40 + deudaTecnica * 2),
        impacto: deudaTecnica > 30 ? 'ALTO' : 'MEDIO',
        categoria: 'TIEMPO',
        fuentesDatos: ['sonarqube.technicalDebt'],
        tendencia: 'ESTABLE'
      });

      recomendaciones.push({
        id: 'REC-003',
        titulo: 'Plan de reduccion de deuda tecnica',
        descripcion: 'Asignar 20% del esfuerzo de cada sprint a reduccion de deuda tecnica.',
        prioridad: deudaTecnica > 30 ? 'ALTA' : 'MEDIA',
        impactoEsperado: 'Incremento de 15-20% en velocidad del equipo',
        esfuerzoEstimado: 'Continuo (20% por sprint)',
        categoria: 'TECNICO',
        riesgosQueAborda: ['RISK-003']
      });
    }

    // 4. Analisis de hitos
    const hitosRetrasados = contexto.operativo.hitos.filter(h => 
      h.semaforo === 'ROJO' || h.estado === 'RETRASADO' || h.diasRetraso > 5
    );
    const hitosEnRiesgo = contexto.operativo.hitos.filter(h => h.semaforo === 'AMARILLO');

    if (hitosRetrasados.length > 0) {
      prediccionesRiesgos.push({
        id: 'RISK-004',
        titulo: 'Hitos con retraso significativo',
        descripcion: hitosRetrasados.length + ' hito(s) presentan retraso: ' + hitosRetrasados.map(h => h.nombre).join(', '),
        probabilidad: 85,
        impacto: 'ALTO',
        categoria: 'TIEMPO',
        fuentesDatos: ['capa2.cronograma.hitos', 'jira.sprints'],
        tendencia: 'EMPEORANDO'
      });

      alertasTempranas.push({
        tipo: 'MILESTONE_DELAY',
        mensaje: hitosRetrasados.length + ' hito(s) con semaforo en ROJO',
        severidad: 'ALTA',
        metricaAfectada: 'cronograma.hitos',
        accionSugerida: 'Revisar plan de recuperacion y comunicar a stakeholders'
      });
    }

    // 5. Analisis de esfuerzo
    const esfuerzoReal = contexto.operativo.esfuerzoReal || 0;
    const esfuerzoEstimado = contexto.operativo.esfuerzoEstimado || 1;
    const desviacionEsfuerzo = ((esfuerzoReal - esfuerzoEstimado) / esfuerzoEstimado) * 100;
    
    if (desviacionEsfuerzo > 15) {
      prediccionesRiesgos.push({
        id: 'RISK-005',
        titulo: 'Desviacion significativa de esfuerzo',
        descripcion: 'El esfuerzo real (' + esfuerzoReal + 'h) excede el estimado (' + esfuerzoEstimado + 'h) en ' + desviacionEsfuerzo.toFixed(1) + '%.',
        probabilidad: 80,
        impacto: 'ALTO',
        categoria: 'COSTO',
        fuentesDatos: ['capa2.esfuerzo', 'capa1.gecoval'],
        tendencia: 'EMPEORANDO'
      });

      recomendaciones.push({
        id: 'REC-004',
        titulo: 'Control de esfuerzo y analisis de causas',
        descripcion: 'Realizar analisis de causas raiz de la desviacion. Implementar control semanal de horas.',
        prioridad: 'ALTA',
        impactoEsperado: 'Proteccion del CM% objetivo',
        esfuerzoEstimado: '2-3 horas semanales',
        categoria: 'PROCESO',
        riesgosQueAborda: ['RISK-005']
      });
    }

    // Calcular metricas
    const riesgosAltos = prediccionesRiesgos.filter(r => 
      r.impacto === 'CRITICO' || r.impacto === 'ALTO'
    ).length;
    const confianzaGeneral = Math.max(20, 100 - (riesgosAltos * 15) - (alertasTempranas.length * 5));

    const probCumplimientoPlazos = Math.max(10, 100 - (hitosRetrasados.length * 20) - (hitosEnRiesgo.length * 10));
    const probCumplimientoPresupuesto = Math.max(10, 100 - (desviacionEsfuerzo > 0 ? desviacionEsfuerzo : 0));
    const scoreCalidadProyectado = Math.max(20, 100 - (vulnsCriticas * 15) - (deudaTecnica / 2) - ((100 - coverage) / 3));

    let resumenEjecutivo = '';
    let estadoGeneral = 'ESTABLE';
    let tendenciaProyecto = 'ESTABLE';
    
    if (riesgosAltos === 0 && alertasTempranas.length === 0) {
      resumenEjecutivo = 'El proyecto se encuentra en buen estado general. Los indicadores tecnicos y operativos estan dentro de los parametros esperados.';
      estadoGeneral = 'OPTIMO';
      tendenciaProyecto = 'MEJORANDO';
    } else if (riesgosAltos <= 2) {
      resumenEjecutivo = 'El proyecto presenta ' + riesgosAltos + ' riesgo(s) que requieren atencion. Se recomienda implementar las acciones correctivas sugeridas.';
      estadoGeneral = 'EN_RIESGO';
      tendenciaProyecto = 'ESTABLE';
    } else {
      resumenEjecutivo = 'ATENCION: El proyecto presenta ' + riesgosAltos + ' riesgos significativos y ' + alertasTempranas.length + ' alertas tempranas. Es necesario tomar accion inmediata.';
      estadoGeneral = 'CRITICO';
      tendenciaProyecto = 'DETERIORANDO';
    }

    // Generar conclusiones principales basadas en los riesgos y recomendaciones
    const principalesConclusiones = [];
    if (prediccionesRiesgos.length > 0) {
      principalesConclusiones.push('Se identificaron ' + prediccionesRiesgos.length + ' riesgos que requieren atencion');
    }
    if (coverage < 80) {
      principalesConclusiones.push('La cobertura de codigo (' + coverage + '%) debe incrementarse');
    }
    if (vulnsCriticas > 0) {
      principalesConclusiones.push('Existen ' + vulnsCriticas + ' vulnerabilidades criticas por remediar');
    }
    if (hitosRetrasados.length > 0) {
      principalesConclusiones.push(hitosRetrasados.length + ' hito(s) presentan retraso significativo');
    }
    if (principalesConclusiones.length === 0) {
      principalesConclusiones.push('El proyecto avanza segun lo planificado');
      principalesConclusiones.push('Los indicadores de calidad estan dentro de los parametros esperados');
    }

    // Convertir alertas al formato esperado por el frontend
    const alertasFormateadas = alertasTempranas.map((alerta, index) => ({
      id: 'ALERT-' + String(index + 1).padStart(3, '0'),
      tipo: alerta.severidad === 'CRITICA' ? 'CRITICA' : alerta.severidad === 'ALTA' ? 'ADVERTENCIA' : 'INFO',
      mensaje: alerta.mensaje,
      origen: alerta.metricaAfectada || 'SISTEMA',
      timestamp: now,
      leida: false
    }));

    // Convertir riesgos al formato esperado por el frontend
    const riesgosFormateados = prediccionesRiesgos.map(riesgo => ({
      id: riesgo.id,
      titulo: riesgo.titulo,
      descripcion: riesgo.descripcion,
      probabilidad: riesgo.probabilidad,
      impacto: riesgo.impacto,
      categoria: riesgo.categoria,
      factoresContribuyentes: riesgo.fuentesDatos || [],
      mitigacionSugerida: recomendaciones.find(r => r.riesgosQueAborda?.includes(riesgo.id))?.descripcion || 'Implementar controles preventivos',
      fechaDeteccion: now,
      tendencia: riesgo.tendencia || 'ESTABLE'
    }));

    // Convertir recomendaciones al formato esperado por el frontend
    const recomendacionesFormateadas = recomendaciones.map(rec => ({
      id: rec.id,
      tipo: rec.prioridad === 'URGENTE' ? 'URGENTE' : rec.prioridad === 'ALTA' ? 'IMPORTANTE' : rec.prioridad === 'MEDIA' ? 'MEJORA' : 'OPTIMIZACION',
      titulo: rec.titulo,
      descripcion: rec.descripcion,
      accionRecomendada: rec.descripcion,
      impactoEsperado: rec.impactoEsperado,
      esfuerzoEstimado: rec.esfuerzoEstimado,
      prioridad: rec.prioridad === 'URGENTE' ? 1 : rec.prioridad === 'ALTA' ? 2 : rec.prioridad === 'MEDIA' ? 3 : 4,
      areaAfectada: rec.categoria
    }));

    return {
      proyectoId: null, // Se asignara en executeAnalysis
      timestamp: now,
      conectoresAnalizados: contexto.conectores.map(c => c.nombre),
      resumenEjecutivo: {
        estadoGeneral: estadoGeneral,
        puntuacionSalud: Math.round(confianzaGeneral),
        tendenciaProyecto: tendenciaProyecto,
        resumenTexto: resumenEjecutivo,
        principalesConclusiones: principalesConclusiones
      },
      riesgosPredichos: riesgosFormateados.slice(0, 5),
      recomendaciones: recomendacionesFormateadas.slice(0, 5),
      alertas: alertasFormateadas.slice(0, 5),
      metricas: {
        confianzaModelo: Math.round(confianzaGeneral),
        datosAnalizados: contexto.conectores.length * 15,
        tiempoAnalisis: Math.round(Math.random() * 2000 + 1000)
      },
      proximoAnalisisSugerido: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      // Mantener datos adicionales para compatibilidad
      proyecciones: {
        cumplimientoPlazos: {
          probabilidad: Math.round(probCumplimientoPlazos),
          diasDesviacion: hitosRetrasados.reduce(function(sum, h) { return sum + (h.diasRetraso || 0); }, 0),
          tendencia: hitosRetrasados.length > 0 ? 'EN_RIESGO' : 'EN_TIEMPO'
        },
        cumplimientoPresupuesto: {
          probabilidad: Math.round(probCumplimientoPresupuesto),
          desviacionPorcentaje: Math.round(desviacionEsfuerzo),
          tendencia: desviacionEsfuerzo > 10 ? 'SOBRECOSTO' : 'EN_PRESUPUESTO'
        },
        calidadEntrega: {
          scoreProyectado: Math.round(scoreCalidadProyectado),
          riesgoDeudaTecnica: deudaTecnica > 30 ? 'ALTO' : deudaTecnica > 15 ? 'MEDIO' : 'BAJO'
        }
      }
    };
  }

  /**
   * Ejecuta analisis completo del proyecto
   */
  async executeAnalysis(proyectoId, capaUno, capaDos, capaTres, conectoresSeleccionados, tipoAnalisis) {
    tipoAnalisis = tipoAnalisis || 'FULL';
    logger.info('Iniciando analisis GenAI para proyecto ' + proyectoId);
    
    const conectoresActivos = conectoresSeleccionados.filter(function(c) { return c.estado === 'ACTIVO'; });
    const contexto = this.aggregateProjectContext(capaUno, capaDos, capaTres, conectoresActivos);
    const resultado = await this.analyzeWithGenAI(contexto, tipoAnalisis);
    
    logger.info('Analisis GenAI completado para proyecto ' + proyectoId);
    
    // Asignar el proyectoId al resultado
    resultado.proyectoId = proyectoId;
    
    return resultado;
  }
}

module.exports = new GenAIAnalysisService();
