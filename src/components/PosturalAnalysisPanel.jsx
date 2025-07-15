import React, { useState } from 'react';
import { Card, Row, Col, Nav, Tab, Badge, Alert, ProgressBar } from 'react-bootstrap';
import PosturalAnalysis from './PosturalAnalysis';

function PosturalAnalysisPanel({ images, onAnalysisComplete }) {
  const [activeTab, setActiveTab] = useState('analysis');
  const [analysisResults, setAnalysisResults] = useState({});
  
  const vistas = [
    { 
      key: 'Frontal', 
      name: 'Vista Frontal', 
      icon: 'fas fa-user',
      description: 'Análisis de simetría y alineación frontal',
      color: 'primary'
    },
    { 
      key: 'Posterior', 
      name: 'Vista Posterior', 
      icon: 'fas fa-user',
      description: 'Evaluación de la espalda y columna vertebral',
      color: 'success'
    },
    { 
      key: 'Lateral Izquierda', 
      name: 'Perfil Izquierdo', 
      icon: 'fas fa-user-alt',
      description: 'Análisis sagital izquierdo',
      color: 'info'
    },
    { 
      key: 'Lateral Derecha', 
      name: 'Perfil Derecho', 
      icon: 'fas fa-user-alt',
      description: 'Análisis sagital derecho',
      color: 'warning'
    }
  ];

  const availableViews = vistas.filter(vista => images[vista.key]);
  const totalImages = Object.keys(images).length;
  const analysisProgress = (Object.keys(analysisResults).length / Math.max(totalImages, 1)) * 100;

  const handleAnalysisComplete = (viewName, results) => {
    console.log(`PosturalAnalysisPanel: Análisis completado para ${viewName}`);
    
    // Guardar localmente para el resumen
    setAnalysisResults(prev => ({
      ...prev,
      [viewName]: results
    }));

    // NUEVO: Pasar los resultados al componente padre (App.jsx)
    if (onAnalysisComplete) {
      onAnalysisComplete(viewName, results);
    }
  };

  const getOverallAssessment = () => {
    // Obtener todos los resultados de análisis de manera segura
    const allResults = [];
    
    Object.values(analysisResults).forEach(result => {
      // Verificar que result existe y tiene la estructura esperada
      if (result && result.summary && Array.isArray(result.summary)) {
        allResults.push(...result.summary);
      } else if (result && Array.isArray(result)) {
        // Si result es directamente un array
        allResults.push(...result);
      }
    });

    if (allResults.length === 0) return null;

    // Contar severidades de manera segura
    const severityCount = {
      'Normal': 0,
      'Leve': 0,
      'Moderada': 0,
      'Alta': 0
    };

    allResults.forEach(r => {
      if (r && r.severidad && severityCount.hasOwnProperty(r.severidad)) {
        severityCount[r.severidad]++;
      }
    });

    const totalFindings = allResults.length;
    
    // Encontrar severidad predominante
    const predominantSeverity = Object.entries(severityCount)
      .reduce((a, b) => severityCount[a[0]] >= severityCount[b[0]] ? a : b)[0];

    return {
      total: totalFindings,
      severityCount,
      predominant: predominantSeverity,
      percentage: {
        normal: totalFindings > 0 ? (severityCount.Normal / totalFindings * 100).toFixed(1) : 0,
        issues: totalFindings > 0 ? ((totalFindings - severityCount.Normal) / totalFindings * 100).toFixed(1) : 0
      }
    };
  };

  const overallAssessment = getOverallAssessment();

  return (
    <div className="mt-4">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-gradient-dark text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1">
                <i className="fas fa-robot me-2"></i>
                Análisis Postural Computarizado
              </h3>
              <p className="mb-0 text-light">
                Evaluación automatizada mediante Inteligencia Artificial
              </p>
            </div>
            <div className="text-end">
              <Badge bg="light" text="dark" className="me-2">
                <i className="fas fa-images me-1"></i>
                {totalImages} imagen{totalImages !== 1 ? 'es' : ''}
              </Badge>
              <Badge bg="success">
                <i className="fas fa-check-circle me-1"></i>
                Sistema activo
              </Badge>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {/* Barra de Progreso del Análisis */}
          {totalImages > 0 && (
            <div className="p-3 bg-light border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-dark">Progreso del Análisis</span>
                <span className="text-muted">{Object.keys(analysisResults).length}/{totalImages} completado</span>
              </div>
              <ProgressBar 
                now={analysisProgress} 
                variant={analysisProgress === 100 ? "success" : "primary"}
                animated={analysisProgress < 100}
                className="shadow-sm"
                style={{ height: '8px' }}
              />
              
              {/* NUEVA INFORMACIÓN: Estado del guardado */}
              {Object.keys(analysisResults).length > 0 && (
                <div className="mt-2">
                  <small className="text-success">
                    <i className="fas fa-save me-1"></i>
                    Los análisis completados se guardarán automáticamente al guardar la evaluación
                  </small>
                </div>
              )}
            </div>
          )}

          {/* Resumen General */}
          {overallAssessment && (
            <div className="p-3 bg-gradient-light border-bottom">
              <h6 className="text-primary mb-3">
                <i className="fas fa-chart-line me-2"></i>
                Resumen Ejecutivo del Análisis
              </h6>
              <Row>
                <Col md={8}>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <Badge bg="success" className="px-3 py-2">
                      Normal: {overallAssessment.severityCount.Normal}
                    </Badge>
                    <Badge bg="warning" text="dark" className="px-3 py-2">
                      Leve: {overallAssessment.severityCount.Leve}
                    </Badge>
                    <Badge bg="orange" className="px-3 py-2">
                      Moderada: {overallAssessment.severityCount.Moderada}
                    </Badge>
                    <Badge bg="danger" className="px-3 py-2">
                      Alta: {overallAssessment.severityCount.Alta}
                    </Badge>
                  </div>
                  <p className="text-muted mb-0">
                    <strong>Evaluación predominante:</strong> {overallAssessment.predominant} | 
                    <strong> Hallazgos normales:</strong> {overallAssessment.percentage.normal}% | 
                    <strong> Requiere atención:</strong> {overallAssessment.percentage.issues}%
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <div className="bg-white rounded p-2 shadow-sm border">
                    <div className="text-primary fw-bold fs-4">{overallAssessment.total}</div>
                    <div className="text-muted small">Hallazgos totales</div>
                  </div>
                </Col>
              </Row>
            </div>
          )}

          {/* Navegación por Pestañas */}
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav variant="tabs" className="border-0 bg-white px-3">
              <Nav.Item>
                <Nav.Link eventKey="analysis" className="text-primary fw-semibold">
                  <i className="fas fa-microscope me-2"></i>
                  Análisis Detallado
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="comparison" className="text-primary fw-semibold">
                  <i className="fas fa-balance-scale me-2"></i>
                  Comparación de Vistas
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="methodology" className="text-primary fw-semibold">
                  <i className="fas fa-cogs me-2"></i>
                  Metodología
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Pestaña de Análisis Detallado */}
              <Tab.Pane eventKey="analysis" className="p-4">
                {availableViews.length === 0 ? (
                  <Alert variant="info" className="text-center">
                    <i className="fas fa-camera fa-2x mb-3 d-block"></i>
                    <h5>No hay imágenes para analizar</h5>
                    <p className="mb-0">
                      Por favor, cargue al menos una imagen del paciente para iniciar el análisis postural.
                    </p>
                  </Alert>
                ) : (
                  <Row>
                    {availableViews.map((vista) => (
                      <Col xl={6} key={vista.key} className="mb-4">
                        <PosturalAnalysis 
                          imageSrc={images[vista.key]} 
                          viewName={vista.key}
                          onAnalysisComplete={handleAnalysisComplete}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab.Pane>

              {/* Pestaña de Comparación */}
              <Tab.Pane eventKey="comparison" className="p-4">
                <h5 className="text-primary mb-4">
                  <i className="fas fa-balance-scale me-2"></i>
                  Comparación Entre Vistas
                </h5>
                
                {Object.keys(analysisResults).length < 2 ? (
                  <Alert variant="warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Se necesitan al menos 2 análisis completados para realizar comparaciones.
                  </Alert>
                ) : (
                  <div>
                    {/* Comparación de Simetría */}
                    {(analysisResults['Frontal'] || analysisResults['Posterior']) && (
                      <Card className="mb-4 border-primary">
                        <Card.Header className="bg-primary text-white">
                          <h6 className="mb-0">
                            <i className="fas fa-arrows-alt-h me-2"></i>
                            Análisis de Simetría (Vista Frontal/Posterior)
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            {['Frontal', 'Posterior'].map(vista => {
                              const result = analysisResults[vista];
                              const summary = result?.summary || result || [];
                              
                              return Array.isArray(summary) && summary.length > 0 ? (
                                <Col md={6} key={vista}>
                                  <h6 className="text-primary">{vista}</h6>
                                  <ul className="list-unstyled">
                                    {summary.map((hallazgo, idx) => (
                                      <li key={idx} className="mb-2">
                                        <Badge bg={hallazgo.severidad === 'Normal' ? 'success' : 'warning'} className="me-2">
                                          {hallazgo.severidad}
                                        </Badge>
                                        {hallazgo.hallazgo}: {hallazgo.valor}
                                      </li>
                                    ))}
                                  </ul>
                                </Col>
                              ) : null;
                            })}
                          </Row>
                        </Card.Body>
                      </Card>
                    )}

                    {/* Comparación Sagital */}
                    {(analysisResults['Lateral Izquierda'] || analysisResults['Lateral Derecha']) && (
                      <Card className="mb-4 border-info">
                        <Card.Header className="bg-info text-white">
                          <h6 className="mb-0">
                            <i className="fas fa-arrows-alt-v me-2"></i>
                            Análisis Sagital (Perfiles Laterales)
                          </h6>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            {['Lateral Izquierda', 'Lateral Derecha'].map(vista => {
                              const result = analysisResults[vista];
                              const summary = result?.summary || result || [];
                              
                              return Array.isArray(summary) && summary.length > 0 ? (
                                <Col md={6} key={vista}>
                                  <h6 className="text-info">{vista}</h6>
                                  <ul className="list-unstyled">
                                    {summary.map((hallazgo, idx) => (
                                      <li key={idx} className="mb-2">
                                        <Badge bg={hallazgo.severidad === 'Normal' ? 'success' : 'warning'} className="me-2">
                                          {hallazgo.severidad}
                                        </Badge>
                                        {hallazgo.hallazgo}: {hallazgo.valor}
                                      </li>
                                    ))}
                                  </ul>
                                </Col>
                              ) : null;
                            })}
                          </Row>
                        </Card.Body>
                      </Card>
                    )}

                    {/* Correlaciones y Compensaciones */}
                    <Card className="border-secondary">
                      <Card.Header className="bg-secondary text-white">
                        <h6 className="mb-0">
                          <i className="fas fa-link me-2"></i>
                          Patrones de Compensación Identificados
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <Alert variant="info">
                          <i className="fas fa-lightbulb me-2"></i>
                          <strong>Interpretación Clínica:</strong> Los patrones posturales observados pueden estar relacionados. 
                          Las alteraciones en un plano pueden generar compensaciones en otros planos anatómicos.
                        </Alert>
                        
                        <div className="text-muted">
                          <small>
                            <strong>Nota:</strong> Esta sección requiere análisis clínico especializado para identificar 
                            patrones de compensación específicos basados en los hallazgos individuales.
                          </small>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Tab.Pane>

              {/* Pestaña de Metodología */}
              <Tab.Pane eventKey="methodology" className="p-4">
                <h5 className="text-primary mb-4">
                  <i className="fas fa-cogs me-2"></i>
                  Metodología y Especificaciones Técnicas
                </h5>

                <Row>
                  <Col lg={6}>
                    <Card className="h-100 border-primary">
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">
                          <i className="fas fa-brain me-2"></i>
                          Tecnología de IA
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <i className="fas fa-check text-success me-2"></i>
                            <strong>Modelo:</strong> PoseNet (TensorFlow.js)
                          </li>
                          <li className="mb-2">
                            <i className="fas fa-check text-success me-2"></i>
                            <strong>Arquitectura:</strong> MobileNetV1
                          </li>
                          <li className="mb-2">
                            <i className="fas fa-check text-success me-2"></i>
                            <strong>Keypoints:</strong> 17 puntos anatómicos
                          </li>
                          <li className="mb-2">
                            <i className="fas fa-check text-success me-2"></i>
                            <strong>Precisión:</strong> ±2-3mm en condiciones óptimas
                          </li>
                          <li className="mb-0">
                            <i className="fas fa-check text-success me-2"></i>
                            <strong>Tiempo de análisis:</strong> 2-5 segundos por imagen
                          </li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col lg={6}>
                    <Card className="h-100 border-success">
                      <Card.Header className="bg-success text-white">
                        <h6 className="mb-0">
                          <i className="fas fa-ruler-combined me-2"></i>
                          Parámetros de Evaluación
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <i className="fas fa-angle-right text-primary me-2"></i>
                            <strong>Alineación:</strong> Desviaciones angulares
                          </li>
                          <li className="mb-2">
                            <i className="fas fa-angle-right text-primary me-2"></i>
                            <strong>Simetría:</strong> Comparación bilateral
                          </li>
                          <li className="mb-2">
                            <i className="fas fa-angle-right text-primary me-2"></i>
                            <strong>Plomada virtual:</strong> Línea de referencia
                          </li>
                          <li className="mb-2">
                            <i className="fas fa-angle-right text-primary me-2"></i>
                            <strong>Rangos normales:</strong> Basados en literatura clínica
                          </li>
                          <li className="mb-0">
                            <i className="fas fa-angle-right text-primary me-2"></i>
                            <strong>Clasificación:</strong> Normal, Leve, Moderada, Alta
                          </li>
                        </ul>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Card className="mt-4 border-warning">
                  <Card.Header className="bg-warning text-dark">
                    <h6 className="mb-0">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Limitaciones y Consideraciones
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h6 className="text-warning">Limitaciones del Sistema:</h6>
                        <ul className="small">
                          <li>Requiere buena calidad de imagen y iluminación</li>
                          <li>El paciente debe estar visible completamente</li>
                          <li>Ropa ajustada mejora la precisión</li>
                          <li>No reemplaza la evaluación clínica especializada</li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <h6 className="text-warning">Recomendaciones de Uso:</h6>
                        <ul className="small">
                          <li>Utilizar como herramienta de apoyo diagnóstico</li>
                          <li>Complementar con evaluación física directa</li>
                          <li>Considerar el contexto clínico del paciente</li>
                          <li>Repetir análisis en casos dudosos</li>
                        </ul>
                      </Col>
                    </Row>
                  
                    {/* NUEVA SECCIÓN: Información sobre el guardado */}
                    <Alert variant="success" className="mt-3 mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Persistencia de Datos:</strong> Todos los análisis de IA (imágenes con keypoints, 
                      mediciones y hallazgos clínicos) se guardan automáticamente al guardar la evaluación del paciente. 
                      Esto permite revisar el progreso del paciente en futuras consultas.
                    </Alert>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  );
}

export default PosturalAnalysisPanel;