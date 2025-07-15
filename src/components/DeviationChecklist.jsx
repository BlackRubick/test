import React, { useState } from 'react';
import { Card, Form, Row, Col, Badge, Alert, Accordion, Button } from 'react-bootstrap';

const deviationsData = {
  'Columna Vertebral': [
    {
      name: 'Hipercifosis torácica',
      description: 'Aumento de la curvatura torácica normal (> 40°)',
      severity: 'Alta',
      region: 'Torácica',
      prevalence: 'Común en adultos mayores'
    },
    {
      name: 'Hiperlordosis lumbar',
      description: 'Aumento de la curvatura lumbar normal (> 60°)',
      severity: 'Moderada',
      region: 'Lumbar',
      prevalence: 'Frecuente en embarazadas'
    },
    {
      name: 'Rectificación cervical',
      description: 'Pérdida de la lordosis cervical fisiológica',
      severity: 'Moderada',
      region: 'Cervical',
      prevalence: 'Común en trabajo de oficina'
    },
    {
      name: 'Rectificación lumbar',
      description: 'Pérdida de la lordosis lumbar normal',
      severity: 'Alta',
      region: 'Lumbar',
      prevalence: 'Asociada a dolor lumbar'
    },
    {
      name: 'Escoliosis funcional',
      description: 'Curvatura lateral de la columna reversible',
      severity: 'Moderada',
      region: 'Total',
      prevalence: 'Variable por edad'
    }
  ],
  'Pelvis y Cadera': [
    {
      name: 'Anteversión de cadera',
      description: 'Inclinación anterior de la pelvis',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Común en sedentarios'
    },
    {
      name: 'Retroversión de cadera',
      description: 'Inclinación posterior de la pelvis',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Asociada a glúteos débiles'
    },
    {
      name: 'Oblicuidad pélvica',
      description: 'Desnivel de las crestas ilíacas',
      severity: 'Alta',
      region: 'Pelvis',
      prevalence: 'Puede causar escoliosis'
    }
  ],
  'Extremidades Inferiores': [
    {
      name: 'Genu valgo',
      description: 'Rodillas en X, ángulo femorotibial > 6°',
      severity: 'Moderada',
      region: 'Rodillas',
      prevalence: 'Más común en mujeres'
    },
    {
      name: 'Genu varo',
      description: 'Rodillas arqueadas, separación > 5cm',
      severity: 'Moderada',
      region: 'Rodillas',
      prevalence: 'Más común en hombres'
    },
    {
      name: 'Pie plano',
      description: 'Disminución del arco longitudinal medial',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Hasta 20% de la población'
    },
    {
      name: 'Pie cavo',
      description: 'Arco del pie excesivamente elevado',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Menos común que pie plano'
    }
  ],
  'Cintura Escapular': [
    {
      name: 'Rotación interna de hombros',
      description: 'Hombros rotados hacia adelante',
      severity: 'Moderada',
      region: 'Hombros',
      prevalence: 'Muy común en era digital'
    },
    {
      name: 'Elevación unilateral de hombro',
      description: 'Asimetría en altura de hombros',
      severity: 'Leve',
      region: 'Hombros',
      prevalence: 'Común en uso asimétrico'
    },
    {
      name: 'Protracción de cabeza',
      description: 'Adelantamiento de la cabeza respecto al hombro',
      severity: 'Moderada',
      region: 'Cervical',
      prevalence: 'Epidemia moderna'
    }
  ],
  'Otros Hallazgos': [
    {
      name: 'Protrusión abdominal',
      description: 'Proyección anterior del abdomen',
      severity: 'Leve',
      region: 'Abdomen',
      prevalence: 'Relacionada con debilidad core'
    },
    {
      name: 'Asimetría global',
      description: 'Desequilibrio postural generalizado',
      severity: 'Alta',
      region: 'Global',
      prevalence: 'Variable'
    }
  ]
};

function DeviationChecklist({ deviations, setDeviations }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState({});

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setDeviations([...deviations, value]);
    } else {
      setDeviations(deviations.filter((d) => d !== value));
    }
  };

  const toggleInfo = (deviationName) => {
    setShowInfo(prev => ({
      ...prev,
      [deviationName]: !prev[deviationName]
    }));
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      'Leve': 'warning',
      'Moderada': 'orange',
      'Alta': 'danger'
    };
    return badges[severity] || 'secondary';
  };

  const getSelectedCount = () => deviations.length;
  const getTotalDeviations = () => {
    return Object.values(deviationsData).flat().length;
  };

  const filterDeviations = (categoryDeviations) => {
    if (!searchTerm) return categoryDeviations;
    return categoryDeviations.filter(deviation =>
      deviation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deviation.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Card className="mb-4 shadow-lg border-0">
      <Card.Header className="bg-gradient-warning text-dark">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">
              <i className="fas fa-clipboard-check me-2"></i>
              Evaluación de Alteraciones Posturales
            </h5>
            <small>Marque las alteraciones observadas durante la evaluación clínica</small>
          </div>
          <div className="text-end">
            <Badge bg="dark" className="me-2">
              {getSelectedCount()}/{getTotalDeviations()} seleccionadas
            </Badge>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        {/* Controles superiores */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Buscar alteración</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escriba para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-sm"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Filtrar por categoría</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="shadow-sm"
              >
                <option value="all">Todas las categorías</option>
                {Object.keys(deviationsData).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Resumen de selecciones */}
        {getSelectedCount() > 0 && (
          <Alert variant="info" className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <i className="fas fa-info-circle me-2"></i>
                <strong>Alteraciones seleccionadas:</strong> {getSelectedCount()}
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => setDeviations([])}
              >
                <i className="fas fa-times me-1"></i>
                Limpiar todo
              </Button>
            </div>
            <div className="mt-2">
              {deviations.map((deviation, index) => (
                <Badge
                  key={index}
                  bg="primary"
                  className="me-2 mb-1 p-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setDeviations(deviations.filter(d => d !== deviation))}
                >
                  {deviation} <i className="fas fa-times ms-1"></i>
                </Badge>
              ))}
            </div>
          </Alert>
        )}

        {/* Listado de alteraciones por categoría */}
        <Accordion defaultActiveKey="0">
          {Object.entries(deviationsData).map(([category, categoryDeviations], categoryIndex) => {
            if (selectedCategory !== 'all' && selectedCategory !== category) return null;
            
            const filteredDeviations = filterDeviations(categoryDeviations);
            if (filteredDeviations.length === 0) return null;

            return (
              <Accordion.Item key={category} eventKey={categoryIndex.toString()}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <span className="fw-semibold">
                      <i className="fas fa-folder-open me-2 text-primary"></i>
                      {category}
                    </span>
                    <Badge bg="secondary">
                      {filteredDeviations.filter(d => deviations.includes(d.name)).length}/{filteredDeviations.length}
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Row>
                    {filteredDeviations.map((deviation, index) => (
                      <Col lg={6} key={deviation.name} className="mb-3">
                        <Card className={`h-100 border ${deviations.includes(deviation.name) ? 'border-primary bg-light' : 'border-light'}`}>
                          <Card.Body className="p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <Form.Check
                                type="checkbox"
                                id={`deviation-${categoryIndex}-${index}`}
                                value={deviation.name}
                                checked={deviations.includes(deviation.name)}
                                onChange={handleChange}
                                className="me-2"
                              />
                              <div className="flex-grow-1">
                                <Form.Label
                                  htmlFor={`deviation-${categoryIndex}-${index}`}
                                  className="fw-semibold mb-1 cursor-pointer"
                                >
                                  {deviation.name}
                                </Form.Label>
                                <div className="d-flex flex-wrap gap-1 mb-2">
                                  <Badge bg={getSeverityBadge(deviation.severity)} className="small">
                                    {deviation.severity}
                                  </Badge>
                                  <Badge bg="info" className="small">
                                    {deviation.region}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-primary"
                                onClick={() => toggleInfo(deviation.name)}
                              >
                                <i className={`fas fa-${showInfo[deviation.name] ? 'minus' : 'plus'}-circle`}></i>
                              </Button>
                            </div>

                            {showInfo[deviation.name] && (
                              <div className="mt-2 p-2 bg-white rounded border">
                                <p className="small text-muted mb-2">
                                  <strong>Descripción:</strong> {deviation.description}
                                </p>
                                <p className="small text-muted mb-0">
                                  <strong>Prevalencia:</strong> {deviation.prevalence}
                                </p>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>

        {/* Mensaje si no hay resultados */}
        {searchTerm && Object.values(deviationsData).flat().filter(d => 
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
          <Alert variant="warning" className="text-center mt-4">
            <i className="fas fa-search fa-2x mb-3 d-block"></i>
            <h6>No se encontraron alteraciones</h6>
            <p className="mb-0">
              No hay alteraciones que coincidan con "{searchTerm}". 
              Intente con otros términos de búsqueda.
            </p>
          </Alert>
        )}

        {/* Guía rápida */}
        <Card className="mt-4 border-info">
          <Card.Header className="bg-info text-white">
            <h6 className="mb-0">
              <i className="fas fa-lightbulb me-2"></i>
              Guía Rápida de Evaluación
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h6 className="text-info">Severidad Leve</h6>
                <ul className="small">
                  <li>Alteraciones menores</li>
                  <li>Impacto funcional mínimo</li>
                  <li>Ejercicios preventivos</li>
                </ul>
              </Col>
              <Col md={4}>
                <h6 className="text-warning">Severidad Moderada</h6>
                <ul className="small">
                  <li>Alteraciones evidentes</li>
                  <li>Posible impacto funcional</li>
                  <li>Requiere intervención</li>
                </ul>
              </Col>
              <Col md={4}>
                <h6 className="text-danger">Severidad Alta</h6>
                <ul className="small">
                  <li>Alteraciones significativas</li>
                  <li>Impacto funcional probable</li>
                  <li>Atención prioritaria</li>
                </ul>
              </Col>
            </Row>
            
            <Alert variant="light" className="mt-3 mb-0">
              <small>
                <i className="fas fa-exclamation-circle me-2"></i>
                <strong>Nota importante:</strong> Esta evaluación debe complementarse con la 
                exploración física directa y la historia clínica del paciente para un 
                diagnóstico completo y preciso.
              </small>
            </Alert>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
}

export default DeviationChecklist;