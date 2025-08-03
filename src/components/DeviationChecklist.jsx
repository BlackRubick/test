import React, { useState } from 'react';
import { Card, Form, Row, Col, Badge, Alert, Accordion, Button } from 'react-bootstrap';

const deviationsData = {
  'Cadena de Flexión (Retropulsada)': [
    {
      name: 'Flexo de rodillas',
      description: 'Flexión mantenida de las articulaciones de la rodilla',
      severity: 'Moderada',
      region: 'Rodillas',
      prevalence: 'Común en cadena de flexión'
    },
    {
      name: 'Sacro vertical y en cifosis',
      description: 'Posición vertical del sacro con curvatura cifótica',
      severity: 'Alta',
      region: 'Pelvis',
      prevalence: 'Característica de cadena retropulsada'
    },
    {
      name: 'Coxis hacia adentro',
      description: 'Desplazamiento interno del coxis',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Asociada a retroversión pélvica'
    },
    {
      name: 'Cifosis',
      description: 'Aumento de la curvatura cifótica dorsal',
      severity: 'Alta',
      region: 'Columna dorsal',
      prevalence: 'Muy común en posturas flexoras'
    },
    {
      name: 'Esternón hundido',
      description: 'Depresión del esternón hacia posterior',
      severity: 'Moderada',
      region: 'Tórax',
      prevalence: 'Asociada a cifosis'
    },
    {
      name: 'Inversión de cervicales',
      description: 'Pérdida o inversión de la lordosis cervical',
      severity: 'Alta',
      region: 'Cervical',
      prevalence: 'Frecuente en trabajo de escritorio'
    },
    {
      name: 'Retroversión pélvica',
      description: 'Inclinación posterior de la pelvis',
      severity: 'Alta',
      region: 'Pelvis',
      prevalence: 'Característica de cadena de flexión'
    },
    {
      name: 'Rotación interna de cadera',
      description: 'Rotación hacia adentro de la articulación coxofemoral',
      severity: 'Moderada',
      region: 'Cadera',
      prevalence: 'Común en sedentarios'
    },
    {
      name: 'MsSs: descenso, aducción, rotación interna, flexopronación',
      description: 'Patrón de miembros superiores en flexión',
      severity: 'Moderada',
      region: 'Miembros superiores',
      prevalence: 'Típico de cadena flexora'
    },
    {
      name: 'Elevación de la esternoclavicular',
      description: 'Elevación de la articulación esternoclavicular',
      severity: 'Leve',
      region: 'Hombros',
      prevalence: 'Asociada a tensión cervical'
    },
    {
      name: 'Flexión de MsIs',
      description: 'Flexión de miembros inferiores',
      severity: 'Moderada',
      region: 'Miembros inferiores',
      prevalence: 'Patrón flexor global'
    },
    {
      name: 'Cierre de mandíbula',
      description: 'Compresión de la articulación temporomandibular',
      severity: 'Leve',
      region: 'Mandíbula',
      prevalence: 'Relacionada con estrés'
    },
    {
      name: 'Cierre de costillas',
      description: 'Aproximación de las costillas',
      severity: 'Moderada',
      region: 'Tórax',
      prevalence: 'Patrón respiratorio restringido'
    },
    {
      name: 'Proyección anterior de la cabeza',
      description: 'Adelantamiento de la cabeza respecto al eje corporal',
      severity: 'Alta',
      region: 'Cervical',
      prevalence: 'Epidemia moderna'
    },
    {
      name: 'Hipercifosis',
      description: 'Aumento excesivo de la cifosis dorsal',
      severity: 'Alta',
      region: 'Columna dorsal',
      prevalence: 'Común en adultos mayores'
    },
    {
      name: 'Rectificación lumbar',
      description: 'Pérdida de la lordosis lumbar',
      severity: 'Alta',
      region: 'Lumbar',
      prevalence: 'Asociada a dolor lumbar'
    },
    {
      name: 'Valgo de rodilla',
      description: 'Desviación de rodillas hacia adentro',
      severity: 'Moderada',
      region: 'Rodillas',
      prevalence: 'Más común en mujeres'
    },
    {
      name: 'Hallux valgus',
      description: 'Desviación del primer dedo del pie hacia afuera',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Común en uso de calzado inadecuado'
    },
    {
      name: 'Cuerpo posteriorizado',
      description: 'Desplazamiento posterior del centro de gravedad',
      severity: 'Alta',
      region: 'Global',
      prevalence: 'Característico de cadena retropulsada'
    }
  ],
  'Cadena de Extensión (Antepulsada)': [
    {
      name: 'Cuerpo anteriorizado',
      description: 'Desplazamiento anterior del centro de gravedad',
      severity: 'Alta',
      region: 'Global',
      prevalence: 'Característico de cadena antepulsada'
    },
    {
      name: 'Recurvatum de tibia',
      description: 'Hiperextensión de la articulación de la rodilla',
      severity: 'Moderada',
      region: 'Rodillas',
      prevalence: 'Común en hiperlaxitud'
    },
    {
      name: 'Sacro horizontal',
      description: 'Posición horizontal del sacro',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Asociada a anteversión pélvica'
    },
    {
      name: 'Dorso plano',
      description: 'Disminución de la cifosis dorsal normal',
      severity: 'Moderada',
      region: 'Columna dorsal',
      prevalence: 'Menos común que hipercifosis'
    },
    {
      name: 'Rectificación cervical',
      description: 'Pérdida de la lordosis cervical normal',
      severity: 'Alta',
      region: 'Cervical',
      prevalence: 'Muy común en era digital'
    },
    {
      name: 'Báscula posterior de la cabeza',
      description: 'Inclinación posterior de la cabeza',
      severity: 'Moderada',
      region: 'Cervical',
      prevalence: 'Compensación postural'
    },
    {
      name: 'Esternón horizontal',
      description: 'Posición horizontal del esternón',
      severity: 'Leve',
      region: 'Tórax',
      prevalence: 'Asociada a dorso plano'
    },
    {
      name: 'Apertura de mandíbula',
      description: 'Separación de la articulación temporomandibular',
      severity: 'Leve',
      region: 'Mandíbula',
      prevalence: 'Puede causar disfunción ATM'
    },
    {
      name: 'Anteversión pélvica',
      description: 'Inclinación anterior de la pelvis',
      severity: 'Alta',
      region: 'Pelvis',
      prevalence: 'Muy común en sedentarios'
    },
    {
      name: 'Hiperlordosis baja',
      description: 'Aumento de la lordosis lumbar baja',
      severity: 'Alta',
      region: 'Lumbar',
      prevalencia: 'Frecuente con anteversión pélvica'
    },
    {
      name: 'Extensión de MsIs',
      description: 'Extensión excesiva de miembros inferiores',
      severity: 'Moderada',
      region: 'Miembros inferiores',
      prevalence: 'Patrón extensor global'
    },
    {
      name: 'Pie cavo',
      description: 'Aumento excesivo del arco plantar',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Menos común que pie plano'
    },
    {
      name: 'Dedos en garra',
      description: 'Flexión excesiva de los dedos del pie',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Asociada a pie cavo'
    },
    {
      name: 'MsSs: descenso, rotación externa, abducción',
      description: 'Patrón de miembros superiores en extensión',
      severity: 'Moderada',
      region: 'Miembros superiores',
      prevalence: 'Típico de cadena extensora'
    },
    {
      name: 'Apertura de costillas',
      description: 'Separación excesiva de las costillas',
      severity: 'Moderada',
      region: 'Tórax',
      prevalence: 'Patrón respiratorio amplio'
    },
    {
      name: 'Rotación interna de cadera y pierna',
      description: 'Rotación hacia adentro de cadera y pierna',
      severity: 'Moderada',
      region: 'Miembros inferiores',
      prevalence: 'Compensación postural'
    },
    {
      name: 'Ascenso de rótula',
      description: 'Elevación de la rótula',
      severity: 'Leve',
      region: 'Rodillas',
      prevalence: 'Asociada a hiperextensión'
    }
  ],
  'Cadena de Apertura': [
    {
      name: 'Pie en eversión (supino)',
      description: 'Pie volcado hacia afuera con supinación',
      severity: 'Moderada',
      region: 'Pies',
      prevalence: 'Común en deportistas'
    },
    {
      name: 'Rodillas ligera flexión',
      description: 'Flexión leve mantenida de rodillas',
      severity: 'Leve',
      region: 'Rodillas',
      prevalence: 'Postura defensiva'
    },
    {
      name: 'Quintus varus',
      description: 'Desviación del quinto dedo del pie hacia adentro',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Menos común que hallux valgus'
    },
    {
      name: 'Anteproyección de pelvis',
      description: 'Proyección anterior de la pelvis',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Asociada a apertura'
    },
    {
      name: 'Nutación del ilíaco (báscula posterior)',
      description: 'Movimiento de nutación con báscula posterior',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Disfunción sacroilíaca'
    },
    {
      name: 'Isquiones separados',
      description: 'Separación excesiva de tuberosidades isquiáticas',
      severity: 'Leve',
      region: 'Pelvis',
      prevalence: 'Patrón de apertura pélvica'
    },
    {
      name: 'MsSs: ascenso, abducción, rotación externa, supinación',
      description: 'Patrón de apertura en miembros superiores',
      severity: 'Moderada',
      region: 'Miembros superiores',
      prevalence: 'Típico de cadena de apertura'
    },
    {
      name: 'Caderas en rotación externa',
      description: 'Rotación hacia afuera de las caderas',
      severity: 'Moderada',
      region: 'Caderas',
      prevalence: 'Patrón de apertura'
    },
    {
      name: 'Anteproyección del cuello',
      description: 'Proyección anterior del cuello',
      severity: 'Alta',
      region: 'Cervical',
      prevalence: 'Muy común en era digital'
    },
    {
      name: 'Báscula anterior del tronco',
      description: 'Inclinación anterior del tronco',
      severity: 'Moderada',
      region: 'Tronco',
      prevalence: 'Compensación postural'
    },
    {
      name: 'Varo de rodilla',
      description: 'Separación excesiva entre rodillas',
      severity: 'Moderada',
      region: 'Rodillas',
      prevalence: 'Más común en hombres'
    },
    {
      name: 'Varo del calcáneo',
      description: 'Inclinación hacia adentro del calcáneo',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Asociada a pie supino'
    },
    {
      name: 'Hipercifosis alta',
      description: 'Aumento de cifosis en región dorsal alta',
      severity: 'Alta',
      region: 'Columna dorsal alta',
      prevalence: 'Común en trabajadores de escritorio'
    }
  ],
  'Cadena de Cierre': [
    {
      name: 'MsSs: descenso, aducción, rotación interna, flexo-pronación',
      description: 'Patrón de cierre en miembros superiores',
      severity: 'Moderada',
      region: 'Miembros superiores',
      prevalence: 'Típico de cadena de cierre'
    },
    {
      name: 'Clavículas en V',
      description: 'Disposición en V de las clavículas',
      severity: 'Leve',
      region: 'Hombros',
      prevalence: 'Patrón de cierre escapular'
    },
    {
      name: 'Parrilla costal cerrada (cierre costal)',
      description: 'Aproximación excesiva de las costillas',
      severity: 'Moderada',
      region: 'Tórax',
      prevalence: 'Restricción respiratoria'
    },
    {
      name: 'Despegue del borde espinal de los omóplatos',
      description: 'Separación del borde medial de las escápulas',
      severity: 'Moderada',
      region: 'Escápulas',
      prevalence: 'Debilidad de romboides'
    },
    {
      name: 'Contranutación de ilíacos (báscula anterior)',
      description: 'Movimiento de contranutación con báscula anterior',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Disfunción sacroilíaca'
    },
    {
      name: 'Flexo de la coxofemoral',
      description: 'Flexión mantenida de la cadera',
      severity: 'Moderada',
      region: 'Cadera',
      prevalence: 'Común en sedentarios'
    },
    {
      name: 'Flexum rodilla',
      description: 'Flexión mantenida de la rodilla',
      severity: 'Moderada',
      region: 'Rodillas',
      prevalence: 'Acortamiento de isquiotibiales'
    },
    {
      name: 'Valgo de calcáneo',
      description: 'Inclinación hacia afuera del calcáneo',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Asociada a pie plano'
    },
    {
      name: 'Pie plano (pronación)',
      description: 'Disminución del arco plantar con pronación',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Hasta 20% de la población'
    }
  ],
  'Cadena de Inspiración': [
    {
      name: 'Rectitud cervical',
      description: 'Pérdida de la curvatura cervical normal',
      severity: 'Alta',
      region: 'Cervical',
      prevalence: 'Muy común en trabajo de oficina'
    },
    {
      name: 'Inversión cervical',
      description: 'Inversión de la lordosis cervical',
      severity: 'Alta',
      region: 'Cervical',
      prevalence: 'Asociada a rectitud cervical'
    },
    {
      name: 'Tórax en inspiración',
      description: 'Tórax mantenido en posición inspiratoria',
      severity: 'Moderada',
      region: 'Tórax',
      prevalence: 'Patrón respiratorio alterado'
    },
    {
      name: 'Piernas alineadas',
      description: 'Alineación normal de miembros inferiores',
      severity: 'Leve',
      region: 'Miembros inferiores',
      prevalence: 'Patrón neutral'
    },
    {
      name: 'Cuádriceps tónicos',
      description: 'Hipertonía del músculo cuádriceps',
      severity: 'Moderada',
      region: 'Muslos',
      prevalence: 'Común en deportistas'
    },
    {
      name: 'Pelvis posteriorizado',
      description: 'Desplazamiento posterior de la pelvis',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Compensación postural'
    },
    {
      name: 'Hiperlordosis lumbar',
      description: 'Aumento de la lordosis lumbar',
      severity: 'Alta',
      region: 'Lumbar',
      prevalence: 'Frecuente en embarazadas'
    },
    {
      name: 'Recurvatum de fémur',
      description: 'Hiperextensión del fémur',
      severity: 'Moderada',
      region: 'Muslos',
      prevalence: 'Asociada a hiperlaxitud'
    }
  ],
  'Cadena de Espiración': [
    {
      name: 'Recorvatum pasivo',
      description: 'Hiperextensión pasiva de articulaciones',
      severity: 'Leve',
      region: 'Global',
      prevalence: 'Hiperlaxitud ligamentaria'
    },
    {
      name: 'Pelvis anteriorizada',
      description: 'Desplazamiento anterior de la pelvis',
      severity: 'Moderada',
      region: 'Pelvis',
      prevalence: 'Común en anteversión'
    },
    {
      name: 'Tórax trasladado posteriormente',
      description: 'Desplazamiento posterior del tórax',
      severity: 'Moderada',
      region: 'Tórax',
      prevalence: 'Compensación respiratoria'
    },
    {
      name: 'Psoas distendido',
      description: 'Elongación excesiva del músculo psoas',
      severity: 'Moderada',
      region: 'Cadera',
      prevalence: 'Debilidad del psoas'
    },
    {
      name: 'Pie en pronación',
      description: 'Pie colapsado hacia adentro',
      severity: 'Leve',
      region: 'Pies',
      prevalence: 'Común en pie plano'
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
      <Card.Header className="bg-gradient-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-1">
              <i className="fas fa-clipboard-check me-2"></i>
              Evaluación de Cadenas Posturales
            </h5>
            <small>Marque las alteraciones observadas según las cadenas musculares</small>
          </div>
          <div className="text-end">
            <Badge bg="light" text="dark" className="me-2">
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
              <Form.Label className="fw-semibold">Filtrar por cadena</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="shadow-sm"
              >
                <option value="all">Todas las cadenas</option>
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

        {/* Listado de alteraciones por cadena */}
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
                      <i className="fas fa-link me-2 text-primary"></i>
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
              Guía de Cadenas Posturales
            </h6>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-primary">Cadenas Principales</h6>
                <ul className="small">
                  <li><strong>Flexión:</strong> Patrón retropulsado</li>
                  <li><strong>Extensión:</strong> Patrón antepulsado</li>
                  <li><strong>Apertura:</strong> Expansión lateral</li>
                  <li><strong>Cierre:</strong> Compresión medial</li>
                </ul>
              </Col>
              <Col md={6}>
                <h6 className="text-secondary">Cadenas Respiratorias</h6>
                <ul className="small">
                  <li><strong>Inspiración:</strong> Tórax expandido</li>
                  <li><strong>Espiración:</strong> Tórax comprimido</li>
                </ul>
              </Col>
            </Row>
            
            <Alert variant="light" className="mt-3 mb-0">
              <small>
                <i className="fas fa-exclamation-circle me-2"></i>
                <strong>Nota importante:</strong> Las cadenas musculares trabajan de forma integrada. 
                Una alteración en una cadena puede compensarse con cambios en otras cadenas, 
                creando patrones posturales complejos que requieren evaluación global.
              </small>
            </Alert>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
}

export default DeviationChecklist;