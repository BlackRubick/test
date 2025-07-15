import React, { useState } from 'react';
import { Card, Form, Row, Col, InputGroup, Alert } from 'react-bootstrap';

function PatientForm({ setPatientData }) {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    peso: '',
    altura: '',
    genero: '',
    ocupacion: '',
    telefono: '',
    email: '',
    motivoConsulta: '',
    antecedentesMedicos: '',
    medicamentos: '',
    actividad_fisica: '',
    observaciones: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validaciones en tiempo real
    const newErrors = { ...errors };
    
    if (name === 'edad' && value && (value < 1 || value > 120)) {
      newErrors.edad = 'La edad debe estar entre 1 y 120 años';
    } else if (name === 'edad') {
      delete newErrors.edad;
    }
    
    if (name === 'peso' && value && (value < 1 || value > 300)) {
      newErrors.peso = 'El peso debe estar entre 1 y 300 kg';
    } else if (name === 'peso') {
      delete newErrors.peso;
    }
    
    if (name === 'altura' && value && (value < 50 || value > 250)) {
      newErrors.altura = 'La altura debe estar entre 50 y 250 cm';
    } else if (name === 'altura') {
      delete newErrors.altura;
    }

    setErrors(newErrors);
    
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    setPatientData(updatedData);
  };

  const calculateIMC = () => {
    if (formData.peso && formData.altura) {
      const alturaM = formData.altura / 100;
      const imc = (formData.peso / (alturaM * alturaM)).toFixed(1);
      return imc;
    }
    return null;
  };

  const getIMCCategory = (imc) => {
    if (imc < 18.5) return { category: 'Bajo peso', class: 'text-info' };
    if (imc < 25) return { category: 'Normal', class: 'text-success' };
    if (imc < 30) return { category: 'Sobrepeso', class: 'text-warning' };
    return { category: 'Obesidad', class: 'text-danger' };
  };

  const imc = calculateIMC();
  const imcInfo = imc ? getIMCCategory(parseFloat(imc)) : null;

  return (
    <Card className="mb-4 shadow-lg border-0">
      <Card.Header className="bg-gradient-primary text-white">
        <div className="d-flex align-items-center">
          <i className="fas fa-user-md me-2 fs-5"></i>
          <h5 className="mb-0">Ficha Clínica del Paciente</h5>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        <Form>
          {/* Datos Personales */}
          <div className="mb-4">
            <h6 className="text-primary mb-3 border-bottom pb-2">
              <i className="fas fa-id-card me-2"></i>
              Datos Personales
            </h6>
            
            <Row className="mb-3">
              <Col lg={8}>
                <Form.Group controlId="formNombre">
                  <Form.Label className="fw-semibold">
                    Nombre completo <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Ej. Juan Carlos Pérez García"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="shadow-sm"
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group controlId="formEdad">
                  <Form.Label className="fw-semibold">
                    Edad <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup className="shadow-sm">
                    <Form.Control
                      type="number"
                      name="edad"
                      placeholder="28"
                      min="1"
                      max="120"
                      value={formData.edad}
                      onChange={handleChange}
                      isInvalid={!!errors.edad}
                      required
                    />
                    <InputGroup.Text>años</InputGroup.Text>
                  </InputGroup>
                  {errors.edad && (
                    <div className="text-danger small mt-1">{errors.edad}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group controlId="formGenero">
                  <Form.Label className="fw-semibold">Género</Form.Label>
                  <Form.Select
                    name="genero"
                    value={formData.genero}
                    onChange={handleChange}
                    className="shadow-sm"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formTelefono">
                  <Form.Label className="fw-semibold">Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    placeholder="Ej. +52 961 123 4567"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formEmail">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="paciente@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Datos Antropométricos */}
          <div className="mb-4">
            <h6 className="text-primary mb-3 border-bottom pb-2">
              <i className="fas fa-ruler me-2"></i>
              Datos Antropométricos
            </h6>
            
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group controlId="formPeso">
                  <Form.Label className="fw-semibold">Peso</Form.Label>
                  <InputGroup className="shadow-sm">
                    <Form.Control
                      type="number"
                      name="peso"
                      placeholder="70"
                      step="0.1"
                      min="1"
                      max="300"
                      value={formData.peso}
                      onChange={handleChange}
                      isInvalid={!!errors.peso}
                    />
                    <InputGroup.Text>kg</InputGroup.Text>
                  </InputGroup>
                  {errors.peso && (
                    <div className="text-danger small mt-1">{errors.peso}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="formAltura">
                  <Form.Label className="fw-semibold">Altura</Form.Label>
                  <InputGroup className="shadow-sm">
                    <Form.Control
                      type="number"
                      name="altura"
                      placeholder="170"
                      min="50"
                      max="250"
                      value={formData.altura}
                      onChange={handleChange}
                      isInvalid={!!errors.altura}
                    />
                    <InputGroup.Text>cm</InputGroup.Text>
                  </InputGroup>
                  {errors.altura && (
                    <div className="text-danger small mt-1">{errors.altura}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                {imc && (
                  <Alert variant="light" className="mb-0 border shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Índice de Masa Corporal (IMC):</span>
                      <span className={`fw-bold ${imcInfo.class}`}>
                        {imc} kg/m² - {imcInfo.category}
                      </span>
                    </div>
                  </Alert>
                )}
              </Col>
            </Row>
          </div>

          {/* Información Laboral */}
          <div className="mb-4">
            <h6 className="text-primary mb-3 border-bottom pb-2">
              <i className="fas fa-briefcase me-2"></i>
              Información Laboral y Estilo de Vida
            </h6>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formOcupacion">
                  <Form.Label className="fw-semibold">Ocupación</Form.Label>
                  <Form.Control
                    type="text"
                    name="ocupacion"
                    placeholder="Ej. Programador, Secretaria, Obrero..."
                    value={formData.ocupacion}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formActividad">
                  <Form.Label className="fw-semibold">Actividad Física</Form.Label>
                  <Form.Select
                    name="actividad_fisica"
                    value={formData.actividad_fisica}
                    onChange={handleChange}
                    className="shadow-sm"
                  >
                    <option value="">Seleccionar nivel...</option>
                    <option value="sedentario">Sedentario (sin ejercicio)</option>
                    <option value="ligero">Ligero (1-3 días/semana)</option>
                    <option value="moderado">Moderado (3-5 días/semana)</option>
                    <option value="intenso">Intenso (6-7 días/semana)</option>
                    <option value="muy_intenso">Muy intenso (2 veces al día)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Historia Clínica */}
          <div className="mb-4">
            <h6 className="text-primary mb-3 border-bottom pb-2">
              <i className="fas fa-notes-medical me-2"></i>
              Historia Clínica
            </h6>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="formMotivoConsulta">
                  <Form.Label className="fw-semibold">Motivo de Consulta</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="motivoConsulta"
                    placeholder="Describe el motivo principal de la consulta postural..."
                    value={formData.motivoConsulta}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formAntecedentes">
                  <Form.Label className="fw-semibold">Antecedentes Médicos</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="antecedentesMedicos"
                    placeholder="Cirugías, lesiones, enfermedades previas..."
                    value={formData.antecedentesMedicos}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formMedicamentos">
                  <Form.Label className="fw-semibold">Medicamentos Actuales</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="medicamentos"
                    placeholder="Lista de medicamentos que toma actualmente..."
                    value={formData.medicamentos}
                    onChange={handleChange}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Observaciones */}
          <div className="mb-3">
            <h6 className="text-primary mb-3 border-bottom pb-2">
              <i className="fas fa-clipboard-list me-2"></i>
              Observaciones Adicionales
            </h6>
            
            <Form.Group controlId="formObservaciones">
              <Form.Label className="fw-semibold">
                Notas Clínicas y Observaciones del Evaluador
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="observaciones"
                placeholder="Comportamiento postural, síntomas referidos, hallazgos durante la exploración, etc..."
                value={formData.observaciones}
                onChange={handleChange}
                className="shadow-sm"
              />
              <Form.Text className="text-muted">
                Incluya cualquier información relevante para el análisis postural
              </Form.Text>
            </Form.Group>
          </div>

          {/* Indicador de campos obligatorios */}
          <Alert variant="info" className="mt-3">
            <small>
              <i className="fas fa-info-circle me-1"></i>
              Los campos marcados con <span className="text-danger">*</span> son obligatorios para generar el reporte médico.
            </small>
          </Alert>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PatientForm;