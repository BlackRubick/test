import React, { useState, useEffect } from 'react';
import { Card, Alert, Badge, ProgressBar, Row, Col, Button } from 'react-bootstrap';

// Función para analizar cadenas posturales
const analyzePosturalChains = (selectedDeviations) => {
  const deviationToChain = {
    // CADENA DE FLEXIÓN (RETROPULSADA)
    'Flexo de rodillas': 'Cadena de Flexión (Retropulsada)',
    'Sacro vertical y en cifosis': 'Cadena de Flexión (Retropulsada)',
    'Coxis hacia adentro': 'Cadena de Flexión (Retropulsada)',
    'Cifosis': 'Cadena de Flexión (Retropulsada)',
    'Esternón hundido': 'Cadena de Flexión (Retropulsada)',
    'Inversión de cervicales': 'Cadena de Flexión (Retropulsada)',
    'Retroversión pélvica': 'Cadena de Flexión (Retropulsada)',
    'Rotación interna de cadera': 'Cadena de Flexión (Retropulsada)',
    'MsSs: descenso, aducción, rotación interna, flexopronación': 'Cadena de Flexión (Retropulsada)',
    'Elevación de la esternoclavicular': 'Cadena de Flexión (Retropulsada)',
    'Flexión de MsIs': 'Cadena de Flexión (Retropulsada)',
    'Cierre de mandíbula': 'Cadena de Flexión (Retropulsada)',
    'Cierre de costillas': 'Cadena de Flexión (Retropulsada)',
    'Proyección anterior de la cabeza': 'Cadena de Flexión (Retropulsada)',
    'Hipercifosis': 'Cadena de Flexión (Retropulsada)',
    'Rectificación lumbar': 'Cadena de Flexión (Retropulsada)',
    'Valgo de rodilla': 'Cadena de Flexión (Retropulsada)',
    'Hallux valgus': 'Cadena de Flexión (Retropulsada)',
    'Cuerpo posteriorizado': 'Cadena de Flexión (Retropulsada)',

    // CADENA DE EXTENSIÓN (ANTEPULSADA)
    'Cuerpo anteriorizado': 'Cadena de Extensión (Antepulsada)',
    'Recurvatum de tibia': 'Cadena de Extensión (Antepulsada)',
    'Sacro horizontal': 'Cadena de Extensión (Antepulsada)',
    'Dorso plano': 'Cadena de Extensión (Antepulsada)',
    'Rectificación cervical': 'Cadena de Extensión (Antepulsada)',
    'Báscula posterior de la cabeza': 'Cadena de Extensión (Antepulsada)',
    'Esternón horizontal': 'Cadena de Extensión (Antepulsada)',
    'Apertura de mandíbula': 'Cadena de Extensión (Antepulsada)',
    'Anteversión pélvica': 'Cadena de Extensión (Antepulsada)',
    'Hiperlordosis baja': 'Cadena de Extensión (Antepulsada)',
    'Extensión de MsIs': 'Cadena de Extensión (Antepulsada)',
    'Pie cavo': 'Cadena de Extensión (Antepulsada)',
    'Dedos en garra': 'Cadena de Extensión (Antepulsada)',
    'MsSs: descenso, rotación externa, abducción': 'Cadena de Extensión (Antepulsada)',
    'Apertura de costillas': 'Cadena de Extensión (Antepulsada)',
    'Rotación interna de cadera y pierna': 'Cadena de Extensión (Antepulsada)',
    'Ascenso de rótula': 'Cadena de Extensión (Antepulsada)',

    // CADENA DE APERTURA
    'Pie en eversión (supino)': 'Cadena de Apertura',
    'Rodillas ligera flexión': 'Cadena de Apertura',
    'Quintus varus': 'Cadena de Apertura',
    'Anteproyección de pelvis': 'Cadena de Apertura',
    'Nutación del ilíaco (báscula posterior)': 'Cadena de Apertura',
    'Isquiones separados': 'Cadena de Apertura',
    'MsSs: ascenso, abducción, rotación externa, supinación': 'Cadena de Apertura',
    'Caderas en rotación externa': 'Cadena de Apertura',
    'Anteproyección del cuello': 'Cadena de Apertura',
    'Báscula anterior del tronco': 'Cadena de Apertura',
    'Varo de rodilla': 'Cadena de Apertura',
    'Varo del calcáneo': 'Cadena de Apertura',
    'Hipercifosis alta': 'Cadena de Apertura',

    // CADENA DE CIERRE
    'MsSs: descenso, aducción, rotación interna, flexo-pronación': 'Cadena de Cierre',
    'Clavículas en V': 'Cadena de Cierre',
    'Parrilla costal cerrada (cierre costal)': 'Cadena de Cierre',
    'Despegue del borde espinal de los omóplatos': 'Cadena de Cierre',
    'Contranutación de ilíacos (báscula anterior)': 'Cadena de Cierre',
    'Flexo de la coxofemoral': 'Cadena de Cierre',
    'Flexum rodilla': 'Cadena de Cierre',
    'Valgo de calcáneo': 'Cadena de Cierre',
    'Pie plano (pronación)': 'Cadena de Cierre',

    // CADENA DE INSPIRACIÓN
    'Rectitud cervical': 'Cadena de Inspiración',
    'Inversión cervical': 'Cadena de Inspiración',
    'Tórax en inspiración': 'Cadena de Inspiración',
    'Piernas alineadas': 'Cadena de Inspiración',
    'Cuádriceps tónicos': 'Cadena de Inspiración',
    'Pelvis posteriorizado': 'Cadena de Inspiración',
    'Hiperlordosis lumbar': 'Cadena de Inspiración',
    'Recurvatum de fémur': 'Cadena de Inspiración',

    // CADENA DE ESPIRACIÓN
    'Recorvatum pasivo': 'Cadena de Espiración',
    'Pelvis anteriorizada': 'Cadena de Espiración',
    'Tórax trasladado posteriormente': 'Cadena de Espiración',
    'Psoas distendido': 'Cadena de Espiración',
    'Pie en pronación': 'Cadena de Espiración'
  };

  const chainCounts = {};
  selectedDeviations.forEach(deviation => {
    const chain = deviationToChain[deviation];
    if (chain) {
      chainCounts[chain] = (chainCounts[chain] || 0) + 1;
    }
  });

  let predominantChain = null;
  let maxCount = 0;
  let totalDeviations = selectedDeviations.length;

  Object.entries(chainCounts).forEach(([chain, count]) => {
    if (count > maxCount) {
      maxCount = count;
      predominantChain = chain;
    }
  });

  const predominancePercentage = totalDeviations > 0 ? (maxCount / totalDeviations) * 100 : 0;
  
  let predominanceLevel = 'Leve';
  if (predominancePercentage >= 70) {
    predominanceLevel = 'Muy Alta';
  } else if (predominancePercentage >= 50) {
    predominanceLevel = 'Alta';
  } else if (predominancePercentage >= 30) {
    predominanceLevel = 'Moderada';
  }

  return {
    predominantChain,
    predominanceLevel,
    predominancePercentage: predominancePercentage.toFixed(1),
    chainCounts,
    totalDeviations,
    maxCount
  };
};

const getChainColor = (chainName) => {
  const colors = {
    'Cadena de Flexión (Retropulsada)': 'primary',
    'Cadena de Extensión (Antepulsada)': 'success',
    'Cadena de Apertura': 'info',
    'Cadena de Cierre': 'warning',
    'Cadena de Inspiración': 'orange',
    'Cadena de Espiración': 'secondary'
  };
  return colors[chainName] || 'dark';
};

const getChainIcon = (chainName) => {
  const icons = {
    'Cadena de Flexión (Retropulsada)': 'fas fa-arrow-down',
    'Cadena de Extensión (Antepulsada)': 'fas fa-arrow-up',
    'Cadena de Apertura': 'fas fa-expand-arrows-alt',
    'Cadena de Cierre': 'fas fa-compress-arrows-alt',
    'Cadena de Inspiración': 'fas fa-lungs',
    'Cadena de Espiración': 'fas fa-wind'
  };
  return icons[chainName] || 'fas fa-link';
};

const getChainDescription = (chainName) => {
  const descriptions = {
    'Cadena de Flexión (Retropulsada)': {
      description: 'Patrón flexor global con desplazamiento posterior del centro de gravedad',
      characteristics: ['Cifosis aumentada', 'Retroversión pélvica', 'Flexión de extremidades'],
      treatment: 'Fortalecimiento de extensores y reeducación postural'
    },
    'Cadena de Extensión (Antepulsada)': {
      description: 'Patrón extensor global con desplazamiento anterior del centro de gravedad',
      characteristics: ['Hiperlordosis', 'Anteversión pélvica', 'Hiperextensión compensatoria'],
      treatment: 'Fortalecimiento de flexores profundos y estiramientos de extensores'
    },
    'Cadena de Apertura': {
      description: 'Patrón de separación y rotación externa de estructuras corporales',
      characteristics: ['Rotación externa', 'Abducción', 'Dispersión energética'],
      treatment: 'Centralización y fortalecimiento de músculos internos'
    },
    'Cadena de Cierre': {
      description: 'Patrón de aproximación y rotación interna de estructuras corporales',
      characteristics: ['Rotación interna', 'Aducción', 'Compresión hacia línea media'],
      treatment: 'Apertura de espacios y fortalecimiento de músculos externos'
    },
    'Cadena de Inspiración': {
      description: 'Patrón relacionado con bloqueo en fase inspiratoria del ciclo respiratorio',
      characteristics: ['Tórax expandido', 'Hipertonía inspiratoria', 'Rigidez diafragmática'],
      treatment: 'Reeducación respiratoria y relajación de músculos inspiradores'
    },
    'Cadena de Espiración': {
      description: 'Patrón relacionado con bloqueo en fase espiratoria del ciclo respiratorio',
      characteristics: ['Tórax colapsado', 'Debilidad inspiratoria', 'Restricción expansiva'],
      treatment: 'Fortalecimiento inspiratorio y expansión torácica'
    }
  };
  return descriptions[chainName] || {
    description: 'Patrón postural no categorizado',
    characteristics: ['Requiere análisis específico'],
    treatment: 'Evaluación clínica detallada'
  };
};

function PosturalChainAnalyzer({ deviations = [] }) {
  const [analysis, setAnalysis] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (deviations && deviations.length > 0) {
      const result = analyzePosturalChains(deviations);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [deviations]);

  if (!analysis || analysis.totalDeviations === 0) {
    return (
      <Card className="border-success">
        <Card.Header className="bg-success text-white">
          <h6 className="mb-0">
            <i className="fas fa-check-circle me-2"></i>
            Análisis de Cadenas Posturales
          </h6>
        </Card.Header>
        <Card.Body className="text-center py-4">
          <i className="fas fa-user-check fa-3x text-success mb-3"></i>
          <h5 className="text-success">Postura Normal</h5>
          <p className="text-muted mb-0">
            No se detectaron alteraciones posturales significativas.<br/>
            El paciente presenta un patrón postural equilibrado.
          </p>
        </Card.Body>
      </Card>
    );
  }

  const chainInfo = getChainDescription(analysis.predominantChain);
  const chainColor = getChainColor(analysis.predominantChain);
  const chainIcon = getChainIcon(analysis.predominantChain);

  const getPredominanceColor = (percentage) => {
    if (percentage >= 70) return 'success';
    if (percentage >= 50) return 'info';
    if (percentage >= 30) return 'warning';
    return 'secondary';
  };

  return (
    <div className="mt-4">
      <Card className={`border-${chainColor} shadow-lg`}>
        <Card.Header className={`bg-${chainColor} text-white`}>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="fas fa-analytics me-2"></i>
              Análisis de Cadenas Posturales
            </h5>
            <Badge bg="light" text="dark">
              {analysis.totalDeviations} alteración{analysis.totalDeviations !== 1 ? 'es' : ''}
            </Badge>
          </div>
        </Card.Header>

        <Card.Body>
          {/* Resultado Principal */}
          <Alert variant={chainColor} className="mb-4">
            <div className="d-flex align-items-center mb-3">
              <div className={`icon-medical icon-medical-${chainColor} me-3`}>
                <i className={chainIcon}></i>
              </div>
              <div className="flex-grow-1">
                <h4 className="mb-1">
                  <strong>{analysis.predominantChain}</strong>
                </h4>
                <p className="mb-0">
                  <strong>Predominancia:</strong> {analysis.predominanceLevel} ({analysis.predominancePercentage}%)
                </p>
              </div>
              <div className="text-end">
                <div className={`badge bg-${getPredominanceColor(analysis.predominancePercentage)} fs-6 px-3 py-2`}>
                  {analysis.maxCount}/{analysis.totalDeviations}
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold small">Nivel de Predominancia:</label>
              <ProgressBar 
                now={analysis.predominancePercentage} 
                variant={getPredominanceColor(analysis.predominancePercentage)}
                className="mb-2"
                style={{ height: '10px' }}
              />
              <small className="text-muted">
                {analysis.predominancePercentage}% de las alteraciones corresponden a esta cadena
              </small>
            </div>

            <p className="mb-0">
              <i className="fas fa-info-circle me-2"></i>
              {chainInfo.description}
            </p>
          </Alert>

          {/* Distribución por Cadenas */}
          {Object.keys(analysis.chainCounts).length > 1 && (
            <Row className="mb-4">
              <Col>
                <h6 className="text-primary mb-3">
                  <i className="fas fa-chart-bar me-2"></i>
                  Distribución por Cadenas
                </h6>
                <Row>
                  {Object.entries(analysis.chainCounts)
                    .sort(([,a], [,b]) => b - a)
                    .map(([chain, count], index) => {
                      const percentage = ((count / analysis.totalDeviations) * 100).toFixed(1);
                      const isMain = chain === analysis.predominantChain;
                      const color = getChainColor(chain);
                      
                      return (
                        <Col md={6} lg={4} key={chain} className="mb-3">
                          <Card className={`h-100 ${isMain ? `border-${color} bg-light` : 'border-light'}`}>
                            <Card.Body className="p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className={`mb-1 ${isMain ? `text-${color}` : 'text-muted'}`}>
                                  {chain.replace('Cadena de ', '')}
                                  {isMain && <i className="fas fa-crown ms-2 text-warning"></i>}
                                </h6>
                                <Badge bg={isMain ? color : 'secondary'}>
                                  {count}
                                </Badge>
                              </div>
                              <ProgressBar 
                                now={percentage} 
                                variant={isMain ? color : 'secondary'}
                                size="sm"
                                className="mb-2"
                                style={{ height: '6px' }}
                              />
                              <small className={isMain ? `text-${color}` : 'text-muted'}>
                                {percentage}% ({count}/{analysis.totalDeviations})
                              </small>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                </Row>
              </Col>
            </Row>
          )}

          {/* Botón para mostrar detalles */}
          <div className="text-center mb-3">
            <Button 
              variant={`outline-${chainColor}`}
              onClick={() => setShowDetails(!showDetails)}
            >
              <i className={`fas fa-${showDetails ? 'eye-slash' : 'eye'} me-2`}></i>
              {showDetails ? 'Ocultar' : 'Ver'} Información Clínica Detallada
            </Button>
          </div>

          {/* Información Clínica Detallada */}
          {showDetails && (
            <div className="mt-4">
              <Row>
                <Col md={6}>
                  <Card className="border-info h-100">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-stethoscope me-2"></i>
                        Características Clínicas
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <ul className="list-unstyled mb-0">
                        {chainInfo.characteristics.map((char, index) => (
                          <li key={index} className="mb-2">
                            <i className="fas fa-check-circle text-info me-2"></i>
                            {char}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="border-success h-100">
                    <Card.Header className="bg-success text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-heart me-2"></i>
                        Enfoque Terapéutico
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-0">
                        <i className="fas fa-prescription-bottle-alt text-success me-2"></i>
                        {chainInfo.treatment}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Interpretación Clínica */}
              <Card className="mt-4 border-warning">
                <Card.Header className="bg-warning text-dark">
                  <h6 className="mb-0">
                    <i className="fas fa-lightbulb me-2"></i>
                    Interpretación Clínica
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-md-8">
                      <p className="mb-2">
                        <strong>Patrón Postural Identificado:</strong> El paciente presenta un patrón predominante de 
                        <span className={`text-${chainColor} fw-bold`}> {analysis.predominantChain}</span> 
                        con un nivel de predominancia <strong>{analysis.predominanceLevel.toLowerCase()}</strong>.
                      </p>
                      
                      {analysis.predominancePercentage >= 70 ? (
                        <Alert variant="info" className="mb-3">
                          <i className="fas fa-info-circle me-2"></i>
                          <strong>Patrón Puro:</strong> La alta concentración de alteraciones en una sola cadena 
                          indica un patrón postural bien definido que requiere abordaje específico.
                        </Alert>
                      ) : analysis.predominancePercentage >= 50 ? (
                        <Alert variant="warning" className="mb-3">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          <strong>Patrón Mixto:</strong> Aunque hay una cadena predominante, existen compensaciones 
                          en otras cadenas que deben considerarse en el tratamiento.
                        </Alert>
                      ) : (
                        <Alert variant="secondary" className="mb-3">
                          <i className="fas fa-balance-scale me-2"></i>
                          <strong>Patrón Complejo:</strong> Las alteraciones están distribuidas entre múltiples 
                          cadenas, sugiriendo un patrón postural complejo que requiere evaluación integral.
                        </Alert>
                      )}
                    </div>
                    
                    <div className="col-md-4">
                      <div className="text-center p-3 bg-light rounded">
                        <div className={`text-${chainColor} fs-1 mb-2`}>
                          <i className={chainIcon}></i>
                        </div>
                        <div className="fw-bold">{analysis.predominantChain?.replace('Cadena de ', '')}</div>
                        <div className="text-muted small">{analysis.predominancePercentage}% predominancia</div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Recomendaciones */}
              <Card className="mt-4 border-primary">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">
                    <i className="fas fa-clipboard-list me-2"></i>
                    Recomendaciones Clínicas
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="row">
                    <div className="col-md-4">
                      <h6 className="text-primary">Prioridad Inmediata</h6>
                      <p className="small">
                        Abordaje específico del patrón <strong>{analysis.predominantChain}</strong> 
                        mediante técnicas de reeducación postural y ejercicios dirigidos.
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-primary">Seguimiento</h6>
                      <p className="small">
                        Reevaluación en 4-6 semanas para monitorear la evolución del patrón postural 
                        y ajustar el plan terapéutico según la respuesta del paciente.
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-primary">Prevención</h6>
                      <p className="small">
                        Educación postural y ergonomía para evitar la perpetuación del patrón 
                        disfuncional en las actividades de la vida diaria.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default PosturalChainAnalyzer;