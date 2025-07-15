import React, { useState } from 'react';
import { Table, Button, Badge, Card, Row, Col, Form, InputGroup, Alert, Dropdown } from 'react-bootstrap';

function EvaluationsList({ evaluaciones, onView, onDelete, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('fecha');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterBy, setFilterBy] = useState('all');

  if (!evaluaciones || evaluaciones.length === 0) {
    return (
      <Card className="shadow-lg border-0 mt-5">
        <Card.Header className="bg-gradient-primary text-white">
          <h4 className="mb-0">
            <i className="fas fa-history me-2"></i>
            Historial de Evaluaciones
          </h4>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No hay evaluaciones registradas</h5>
          <p className="text-muted mb-0">
            Las evaluaciones posturales aparecerán aquí una vez que se completen.
          </p>
        </Card.Body>
      </Card>
    );
  }

  // Funciones de filtrado y ordenamiento
  const filteredEvaluations = evaluaciones.filter(ev => {
    const matchesSearch = ev.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ev.edad?.toString().includes(searchTerm) ||
                         (ev.desviaciones || []).some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'with_deviations') return matchesSearch && (ev.desviaciones || []).length > 0;
    if (filterBy === 'without_deviations') return matchesSearch && (ev.desviaciones || []).length === 0;
    if (filterBy === 'with_ai') return matchesSearch && (ev.tieneAnalisisIA || (ev.analisisIA && Object.keys(ev.analisisIA).length > 0));
    if (filterBy === 'without_ai') return matchesSearch && !(ev.tieneAnalisisIA || (ev.analisisIA && Object.keys(ev.analisisIA).length > 0));
    if (filterBy === 'recent') {
      const daysSince = Math.floor((new Date() - new Date(ev.fecha)) / (1000 * 60 * 60 * 24));
      return matchesSearch && daysSince <= 7;
    }
    
    return matchesSearch;
  });

  const sortedEvaluations = [...filteredEvaluations].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'nombre':
        aValue = a.nombre || '';
        bValue = b.nombre || '';
        break;
      case 'edad':
        aValue = parseInt(a.edad) || 0;
        bValue = parseInt(b.edad) || 0;
        break;
      case 'fecha':
        aValue = new Date(a.fecha);
        bValue = new Date(b.fecha);
        break;
      case 'desviaciones':
        aValue = (a.desviaciones || []).length;
        bValue = (b.desviaciones || []).length;
        break;
      case 'ai_analysis':
        aValue = Object.keys(a.analisisIA || {}).length;
        bValue = Object.keys(b.analisisIA || {}).length;
        break;
      default:
        aValue = a.fecha;
        bValue = b.fecha;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Función para calcular completitud
  const calculateCompleteness = (evaluation) => {
    let score = 0;
    if (evaluation.nombre && evaluation.nombre !== 'No especificado') score += 25;
    if (evaluation.edad && evaluation.edad !== 'No especificada') score += 25;
    if (evaluation.peso || evaluation.altura) score += 25;
    if (Object.keys(evaluation.imagenes || {}).length > 0) score += 25;
    return score;
  };

  // Función para obtener el estado de la evaluación - ACTUALIZADA
  const getEvaluationStatus = (evaluation) => {
    const completeness = calculateCompleteness(evaluation);
    const hasDeviations = (evaluation.desviaciones || []).length > 0;
    const hasAI = evaluation.tieneAnalisisIA || (evaluation.analisisIA && Object.keys(evaluation.analisisIA).length > 0);
    const daysSince = Math.floor((new Date() - new Date(evaluation.fecha)) / (1000 * 60 * 60 * 24));

    if (completeness < 50) return { type: 'incomplete', text: 'Incompleta', color: 'danger' };
    if (hasAI && hasDeviations) return { type: 'ai_with_findings', text: 'IA + Hallazgos', color: 'warning' };
    if (hasAI) return { type: 'with_ai', text: 'Con IA', color: 'info' };
    if (hasDeviations && daysSince > 30) return { type: 'needs_followup', text: 'Seguimiento', color: 'warning' };
    if (hasDeviations) return { type: 'with_findings', text: 'Con hallazgos', color: 'info' };
    return { type: 'normal', text: 'Normal', color: 'success' };
  };

  // Estadísticas rápidas - ACTUALIZADAS
  const stats = {
    total: evaluaciones.length,
    withDeviations: evaluaciones.filter(ev => (ev.desviaciones || []).length > 0).length,
    withAI: evaluaciones.filter(ev => ev.tieneAnalisisIA || (ev.analisisIA && Object.keys(ev.analisisIA).length > 0)).length,
    recent: evaluaciones.filter(ev => {
      const daysSince = Math.floor((new Date() - new Date(ev.fecha)) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }).length,
    complete: evaluaciones.filter(ev => calculateCompleteness(ev) >= 75).length
  };

  return (
    <div className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-gradient-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">
                <i className="fas fa-history me-2"></i>
                Historial de Evaluaciones
              </h4>
              <small>Gestión completa de evaluaciones posturales con análisis de IA</small>
            </div>
            <Badge bg="light" text="dark" className="px-3 py-2">
              {filteredEvaluations.length} de {evaluaciones.length}
            </Badge>
          </div>
        </Card.Header>

        {/* Panel de estadísticas - ACTUALIZADO */}
        <Card.Body className="bg-light border-bottom p-3">
          <Row>
            <Col md={2}>
              <div className="text-center">
                <div className="text-primary fs-4 fw-bold">{stats.total}</div>
                <small className="text-muted">Total</small>
              </div>
            </Col>
            <Col md={2}>
              <div className="text-center">
                <div className="text-info fs-4 fw-bold">{stats.withDeviations}</div>
                <small className="text-muted">Con alteraciones</small>
              </div>
            </Col>
            <Col md={2}>
              <div className="text-center">
                <div className="text-success fs-4 fw-bold">{stats.withAI}</div>
                <small className="text-muted">Con análisis IA</small>
              </div>
            </Col>
            <Col md={2}>
              <div className="text-center">
                <div className="text-warning fs-4 fw-bold">{stats.complete}</div>
                <small className="text-muted">Completas</small>
              </div>
            </Col>
            <Col md={2}>
              <div className="text-center">
                <div className="text-danger fs-4 fw-bold">{stats.recent}</div>
                <small className="text-muted">Recientes (7 días)</small>
              </div>
            </Col>
            <Col md={2}>
              <div className="text-center">
                <div className="text-secondary fs-4 fw-bold">
                  {Math.round((stats.withAI / Math.max(stats.total, 1)) * 100)}%
                </div>
                <small className="text-muted">% con IA</small>
              </div>
            </Col>
          </Row>
        </Card.Body>

        {/* Controles de búsqueda y filtrado - ACTUALIZADOS */}
        <Card.Body className="border-bottom">
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Buscar evaluaciones</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Nombre, edad, alteraciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Filtrar por</Form.Label>
                <Form.Select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="all">Todas las evaluaciones</option>
                  <option value="with_deviations">Con alteraciones</option>
                  <option value="without_deviations">Sin alteraciones</option>
                  <option value="with_ai">Con análisis IA</option>
                  <option value="without_ai">Sin análisis IA</option>
                  <option value="recent">Recientes (7 días)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Ordenar por</Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="fecha">Fecha</option>
                  <option value="nombre">Nombre</option>
                  <option value="edad">Edad</option>
                  <option value="desviaciones">Alteraciones</option>
                  <option value="ai_analysis">Análisis IA</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Orden</Form.Label>
                <Form.Select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>

        {/* Tabla de evaluaciones - ACTUALIZADA */}
        <Card.Body className="p-0">
          {sortedEvaluations.length === 0 ? (
            <Alert variant="info" className="m-3 text-center">
              <i className="fas fa-filter fa-2x mb-3 d-block"></i>
              <h6>No se encontraron evaluaciones</h6>
              <p className="mb-0">
                {searchTerm || filterBy !== 'all' 
                  ? 'Intente modificar los criterios de búsqueda o filtros.' 
                  : 'No hay evaluaciones registradas aún.'}
              </p>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-4 py-3">
                      <i className="fas fa-user me-2"></i>Paciente
                    </th>
                    <th className="px-3 py-3">
                      <i className="fas fa-calendar me-2"></i>Fecha
                    </th>
                    <th className="px-3 py-3 text-center">
                      <i className="fas fa-exclamation-triangle me-2"></i>Alteraciones
                    </th>
                    <th className="px-3 py-3 text-center">
                      <i className="fas fa-images me-2"></i>Imágenes
                    </th>
                    <th className="px-3 py-3 text-center">
                      <i className="fas fa-robot me-2"></i>Análisis IA
                    </th>
                    <th className="px-3 py-3 text-center">
                      <i className="fas fa-chart-pie me-2"></i>Estado
                    </th>
                    <th className="px-3 py-3 text-center">
                      <i className="fas fa-cogs me-2"></i>Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEvaluations.map((ev, index) => {
                    const status = getEvaluationStatus(ev);
                    const completeness = calculateCompleteness(ev);
                    const daysSince = Math.floor((new Date() - new Date(ev.fecha)) / (1000 * 60 * 60 * 24));
                    const hasAI = ev.tieneAnalisisIA || (ev.analisisIA && Object.keys(ev.analisisIA).length > 0);
                    const aiCount = Object.keys(ev.analisisIA || {}).length;
                    
                    return (
                      <tr key={index} className="border-bottom">
                        <td className="px-4 py-3">
                          <div>
                            <div className="fw-semibold text-dark d-flex align-items-center">
                              {ev.nombre}
                              {hasAI && (
                                <Badge bg="info" className="ms-2 small">
                                  <i className="fas fa-robot me-1"></i>
                                  IA
                                </Badge>
                              )}
                            </div>
                            <small className="text-muted">
                              <i className="fas fa-birthday-cake me-1"></i>
                              {ev.edad} años
                              {ev.genero && (
                                <span className="ms-2">
                                  <i className={`fas fa-${ev.genero === 'masculino' ? 'mars' : ev.genero === 'femenino' ? 'venus' : 'genderless'} me-1`}></i>
                                  {ev.genero}
                                </span>
                              )}
                            </small>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div>
                            <div className="fw-semibold">
                              {new Date(ev.fecha).toLocaleDateString('es-ES')}
                            </div>
                            <small className="text-muted">
                              {daysSince === 0 ? 'Hoy' : 
                               daysSince === 1 ? 'Ayer' : 
                               `Hace ${daysSince} días`}
                            </small>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div>
                            <Badge 
                              bg={(ev.desviaciones || []).length > 0 ? 'warning' : 'success'}
                              className="fs-6 px-3 py-2"
                            >
                              {(ev.desviaciones || []).length}
                            </Badge>
                            {(ev.desviaciones || []).length > 0 && (
                              <div className="mt-1">
                                <small className="text-muted">
                                  {(ev.desviaciones || []).slice(0, 2).join(', ')}
                                  {(ev.desviaciones || []).length > 2 && '...'}
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <Badge 
                            bg={Object.keys(ev.imagenes || {}).length > 0 ? 'info' : 'secondary'}
                            className="fs-6 px-3 py-2"
                          >
                            {Object.keys(ev.imagenes || {}).length}
                          </Badge>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div>
                            {hasAI ? (
                              <Badge bg="success" className="fs-6 px-3 py-2">
                                <i className="fas fa-robot me-1"></i>
                                {aiCount}
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="fs-6 px-3 py-2">
                                <i className="fas fa-minus me-1"></i>
                                0
                              </Badge>
                            )}
                            {hasAI && (
                              <div className="mt-1">
                                <small className="text-success">
                                  <i className="fas fa-check me-1"></i>
                                  Automático
                                </small>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <div>
                            <Badge bg={status.color} className="mb-1">
                              {status.text}
                            </Badge>
                            <div className="progress mt-1" style={{height: '4px'}}>
                              <div 
                                className={`progress-bar bg-${completeness >= 75 ? 'success' : completeness >= 50 ? 'warning' : 'danger'}`}
                                style={{width: `${completeness}%`}}
                              ></div>
                            </div>
                            <small className="text-muted">{completeness}% completo</small>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="d-flex gap-1 justify-content-center">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => onView(ev)}
                              className="px-3"
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            
                            {onEdit && (
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => onEdit(ev)}
                                className="px-3"
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                            )}
                            
                            <Dropdown>
                              <Dropdown.Toggle 
                                variant="outline-secondary" 
                                size="sm"
                                className="px-3"
                              >
                                <i className="fas fa-ellipsis-v"></i>
                              </Dropdown.Toggle>
                              
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => onView(ev)}>
                                  <i className="fas fa-eye me-2"></i>Ver detalles
                                </Dropdown.Item>
                                {hasAI && (
                                  <Dropdown.Item onClick={() => onView(ev)}>
                                    <i className="fas fa-robot me-2 text-info"></i>Ver análisis IA
                                  </Dropdown.Item>
                                )}
                                {onEdit && (
                                  <Dropdown.Item onClick={() => onEdit(ev)}>
                                    <i className="fas fa-edit me-2"></i>Editar
                                  </Dropdown.Item>
                                )}
                                <Dropdown.Divider />
                                <Dropdown.Item 
                                  className="text-danger"
                                  onClick={() => {
                                    if (window.confirm(`¿Eliminar la evaluación de ${ev.nombre}?`)) {
                                      onDelete(index);
                                    }
                                  }}
                                >
                                  <i className="fas fa-trash me-2"></i>Eliminar
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>

        {sortedEvaluations.length > 0 && (
          <Card.Footer className="bg-light text-center">
            <small className="text-muted">
              Mostrando {sortedEvaluations.length} de {evaluaciones.length} evaluaciones
              {stats.withAI > 0 && (
                <span className="text-info ms-2">
                  | {stats.withAI} con análisis de IA
                </span>
              )}
            </small>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
}

export default EvaluationsList;