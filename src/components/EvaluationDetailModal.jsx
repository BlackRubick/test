import React, { useState } from 'react';
import { Modal, Button, Image, Row, Col, Card, Badge, Alert, Tab, Tabs } from 'react-bootstrap';

function EvaluationDetailModal({ evaluation, onClose, onDelete, onEdit }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  if (!evaluation) return null;

  const desviaciones = evaluation.desviaciones || [];
  const imagenes = evaluation.imagenes || {};
  
  // NUEVO: Soporte para análisis de IA
  const analisisIA = evaluation.analisisIA || {};
  const tieneAnalisisIA = evaluation.tieneAnalisisIA || Object.keys(analisisIA).length > 0;

  // Función para descargar PDF usando la misma lógica que funciona
  const handleDownloadPDF = async () => {
    console.log('=== INICIO GENERACIÓN PDF DESDE MODAL ===');
    
    setIsGeneratingPDF(true);

    try {
      // Importar jsPDF de la misma forma que funciona
      console.log('Importando jsPDF...');
      const jsPDF = (await import('jspdf')).jsPDF;
      await import('jspdf-autotable');
      console.log('jsPDF importado correctamente');

      // Crear documento
      console.log('Creando documento PDF...');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let currentY = 20;

      // ==================== ENCABEZADO ====================
      console.log('Agregando encabezado...');
      doc.setFillColor(45, 123, 182);
      doc.rect(14, 10, pageWidth - 28, 25, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('REPORTE DE EVALUACIÓN POSTURAL', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Sistema de Análisis Postural', pageWidth / 2, 30, { align: 'center' });
      
      currentY = 45;

      // ==================== DATOS DEL PACIENTE ====================
      console.log('Agregando datos del paciente...');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10); // Reducido de 12 a 10
      doc.setFont('helvetica', 'bold');
      doc.text('DATOS DEL PACIENTE', 14, currentY);
      currentY += 8; // Reducido de 10 a 8

      // Datos del paciente
      doc.setFontSize(8); // Reducido de 10 a 8
      doc.setFont('helvetica', 'normal');
      
      const patientFields = [
        ['Nombre:', evaluation.nombre || 'No especificado'],
        ['Edad:', `${evaluation.edad || 'No especificada'} años`],
        ['Género:', evaluation.genero || 'No especificado'],
        ['Peso:', evaluation.peso ? `${evaluation.peso} kg` : 'No especificado'],
        ['Altura:', evaluation.altura ? `${evaluation.altura} cm` : 'No especificado'],
        ['Ocupación:', evaluation.ocupacion || 'No especificada'],
        ['Teléfono:', evaluation.telefono || 'No especificado'],
        ['Email:', evaluation.email || 'No especificado'],
        ['Actividad Física:', evaluation.actividad_fisica || 'No especificada'],
        ['Fecha de Evaluación:', new Date(evaluation.fecha).toLocaleDateString('es-ES')],
        ['Hora:', new Date(evaluation.fecha).toLocaleTimeString('es-ES')]
      ];

      // Agregar IMC si hay datos
      if (evaluation.peso && evaluation.altura) {
        const imc = (evaluation.peso / ((evaluation.altura / 100) ** 2)).toFixed(1);
        let categoria = '';
        if (imc < 18.5) categoria = 'Bajo peso';
        else if (imc < 25) categoria = 'Normal';
        else if (imc < 30) categoria = 'Sobrepeso';
        else categoria = 'Obesidad';
        
        patientFields.splice(5, 0, ['IMC:', `${imc} kg/m² (${categoria})`]);
      }

      // Mostrar datos en formato simple
      patientFields.forEach(([label, value]) => {
        if (value !== 'No especificado' && value !== 'No especificada') {
          doc.setFont('helvetica', 'bold');
          doc.text(label, 14, currentY);
          doc.setFont('helvetica', 'normal');
          doc.text(value, 55, currentY);
          currentY += 6;
        }
      });

      currentY += 8; // Reducido de 10 a 8

      // ==================== HISTORIA CLÍNICA ====================
      if (evaluation.motivoConsulta || evaluation.antecedentesMedicos || evaluation.medicamentos) {
        console.log('Agregando historia clínica...');
        doc.setFontSize(10); // Reducido de 12 a 10
        doc.setFont('helvetica', 'bold');
        doc.text('HISTORIA CLÍNICA', 14, currentY);
        currentY += 8; // Reducido de 10 a 8

        doc.setFontSize(8); // Reducido de 10 a 8
        doc.setFont('helvetica', 'normal');

        if (evaluation.motivoConsulta) {
          doc.setFont('helvetica', 'bold');
          doc.text('Motivo de Consulta:', 14, currentY);
          currentY += 4; // Reducido de 5 a 4
          doc.setFont('helvetica', 'normal');
          const motivoLines = doc.splitTextToSize(evaluation.motivoConsulta, pageWidth - 28);
          doc.text(motivoLines, 14, currentY);
          currentY += motivoLines.length * 4 + 4; // Reducido el espaciado
        }

        if (evaluation.antecedentesMedicos) {
          doc.setFont('helvetica', 'bold');
          doc.text('Antecedentes Médicos:', 14, currentY);
          currentY += 4; // Reducido de 5 a 4
          doc.setFont('helvetica', 'normal');
          const antecedentesLines = doc.splitTextToSize(evaluation.antecedentesMedicos, pageWidth - 28);
          doc.text(antecedentesLines, 14, currentY);
          currentY += antecedentesLines.length * 4 + 4; // Reducido el espaciado
        }

        if (evaluation.medicamentos) {
          doc.setFont('helvetica', 'bold');
          doc.text('Medicamentos Actuales:', 14, currentY);
          currentY += 4; // Reducido de 5 a 4
          doc.setFont('helvetica', 'normal');
          const medicamentosLines = doc.splitTextToSize(evaluation.medicamentos, pageWidth - 28);
          doc.text(medicamentosLines, 14, currentY);
          currentY += medicamentosLines.length * 4 + 4; // Reducido el espaciado
        }

        currentY += 4; // Reducido de 5 a 4
      }

      // ==================== OBSERVACIONES ====================
      if (evaluation.observaciones) {
        console.log('Agregando observaciones...');
        doc.setFontSize(10); // Reducido de 12 a 10
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES CLÍNICAS', 14, currentY);
        currentY += 6; // Reducido de 8 a 6

        doc.setFontSize(8); // Reducido de 10 a 8
        doc.setFont('helvetica', 'normal');
        const obsLines = doc.splitTextToSize(evaluation.observaciones, pageWidth - 28);
        doc.text(obsLines, 14, currentY);
        currentY += obsLines.length * 4 + 8; // Reducido el espaciado
      }

      // ==================== ANÁLISIS POSTURAL ====================
      console.log('Agregando análisis postural...');
      doc.setFontSize(10); // Reducido de 12 a 10
      doc.setFont('helvetica', 'bold');
      doc.text('ANÁLISIS POSTURAL', 14, currentY);
      currentY += 8; // Reducido de 10 a 8

      doc.setFontSize(8); // Reducido de 10 a 8
      doc.setFont('helvetica', 'normal');

      if (desviaciones && desviaciones.length > 0) {
        doc.text('Alteraciones identificadas:', 14, currentY);
        currentY += 6; // Reducido de 8 a 6

        desviaciones.forEach((desviacion, index) => {
          doc.text(`${index + 1}. ${desviacion}`, 20, currentY);
          currentY += 4; // Reducido de 5 a 4
        });
        currentY += 8; // Reducido de 10 a 8
      } else {
        doc.setTextColor(0, 120, 0);
        doc.text('✓ No se identificaron alteraciones posturales significativas.', 14, currentY);
        currentY += 6; // Reducido de 8 a 6
        doc.setTextColor(0, 0, 0);
        doc.text('El paciente presenta una alineación postural normal.', 14, currentY);
        currentY += 12; // Reducido de 15 a 12
      }

      // ==================== ANÁLISIS DE IA ====================
      if (tieneAnalisisIA && Object.keys(analisisIA).length > 0) {
        console.log('Agregando análisis de IA...');
        
        // Nueva página para análisis de IA
        if (currentY > 180) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(10); // Reducido de 12 a 10
        doc.setFont('helvetica', 'bold');
        doc.text('ANÁLISIS AUTOMATIZADO CON INTELIGENCIA ARTIFICIAL', 14, currentY);
        currentY += 12; // Reducido de 15 a 12

        // Resumen de hallazgos de IA
        let totalHallazgos = 0;
        Object.values(analisisIA).forEach(analisis => {
          if (analisis.summary && Array.isArray(analisis.summary)) {
            totalHallazgos += analisis.summary.length;
          }
        });

        if (totalHallazgos > 0) {
          doc.setFontSize(8); // Reducido de 10 a 8
          doc.setFont('helvetica', 'normal');
          doc.text(`Total de hallazgos automatizados: ${totalHallazgos}`, 14, currentY);
          currentY += 8; // Reducido de 10 a 8

          // Listar hallazgos por vista
          Object.entries(analisisIA).forEach(([vista, analisis]) => {
            if (analisis.summary && Array.isArray(analisis.summary) && analisis.summary.length > 0) {
              doc.setFont('helvetica', 'bold');
              doc.text(`${vista}:`, 14, currentY);
              currentY += 4; // Reducido de 5 a 4
              
              doc.setFont('helvetica', 'normal');
              analisis.summary.forEach((hallazgo, idx) => {
                const texto = `• ${hallazgo.hallazgo}: ${hallazgo.valor} (${hallazgo.severidad})`;
                doc.text(texto, 20, currentY);
                currentY += 4; // Reducido de 5 a 4
              });
              currentY += 3; // Reducido de 5 a 3
            }
          });
        }
      }

      // ==================== IMÁGENES ====================
      const imagesList = imagenes || {};
      const imageCount = Object.keys(imagesList).length;
      
      if (imageCount > 0) {
        console.log(`Procesando ${imageCount} imágenes...`);
        
        // Nueva página para imágenes si es necesario
        if (currentY > 160) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DOCUMENTACIÓN FOTOGRÁFICA', 14, currentY);
        
        // NUEVO: Indicar si hay análisis de IA
        if (tieneAnalisisIA) {
          doc.setFontSize(10);
          doc.setTextColor(45, 123, 182);
          doc.text('(Incluye análisis automatizado con IA)', 14, currentY + 8);
          doc.setTextColor(0, 0, 0);
        }
        
        currentY += 20;

        let processedImages = 0;
        const imageWidth = 80;   // Ancho de cada imagen
        const imageHeight = 60;  // Alto de cada imagen
        const spacing = 12;      // Espacio entre imágenes (reducido)
        const marginLeft = 14;   // Margen izquierdo
        const rowSpacing = 25;   // Espacio entre filas (reducido)
        let currentRowY = currentY; // Posición Y actual

        // Procesar TODAS las vistas disponibles (no limitar a 4)
        for (const [vista, originalSrc] of Object.entries(imagesList)) {
          if (originalSrc) { // Eliminar límite de 4 imágenes
            
            // Verificar si necesitamos nueva página (más conservador)
            if (currentRowY + imageHeight + 20 > pageHeight - 40) {
              doc.addPage();
              currentRowY = 20;
            }
            
            try {
              // ===== IMAGEN ORIGINAL =====
              console.log(`Insertando imagen original ${vista}...`);
              
              const originalX = marginLeft;
              const originalY = currentRowY;
              
              // Marco y imagen original
              doc.setDrawColor(200, 200, 200);
              doc.setLineWidth(1);
              doc.rect(originalX - 1, originalY - 1, imageWidth + 2, imageHeight + 2);
              doc.addImage(originalSrc, 'JPEG', originalX, originalY, imageWidth, imageHeight);
              
              // Etiqueta imagen original
              doc.setFontSize(8);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(0, 0, 0);
              doc.text(`${vista} - Original`, originalX, originalY + imageHeight + 8);
              
              // ===== IMAGEN CON ANÁLISIS IA =====
              const analisisVista = analisisIA[vista];
              const analysisX = originalX + imageWidth + spacing;
              const analysisY = originalY;
              
              if (analisisVista && analisisVista.analysisImage) {
                console.log(`Insertando análisis IA ${vista}...`);
                
                // Marco azul para análisis IA
                doc.setDrawColor(45, 123, 182);
                doc.setLineWidth(2);
                doc.rect(analysisX - 1, analysisY - 1, imageWidth + 2, imageHeight + 2);
                doc.setLineWidth(1);
                
                // Insertar imagen con análisis
                doc.addImage(analisisVista.analysisImage, 'JPEG', analysisX, analysisY, imageWidth, imageHeight);
                
                // Etiqueta de análisis IA
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(45, 123, 182);
                doc.text(`${vista} - Análisis IA`, analysisX, analysisY + imageHeight + 8);
                
                // Icono de IA
                doc.setFontSize(6);
                doc.text('🤖', analysisX + imageWidth - 12, analysisY + 10);
                
              } else {
                // Placeholder para análisis no disponible
                console.log(`Sin análisis IA para ${vista}`);
                doc.setFillColor(240, 240, 240);
                doc.rect(analysisX, analysisY, imageWidth, imageHeight, 'F');
                
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(1);
                doc.rect(analysisX - 1, analysisY - 1, imageWidth + 2, imageHeight + 2);
                
                doc.setFontSize(7);
                doc.setTextColor(100, 100, 100);
                doc.text('Análisis IA', analysisX + imageWidth/2, analysisY + imageHeight/2 - 3, { align: 'center' });
                doc.text('no disponible', analysisX + imageWidth/2, analysisY + imageHeight/2 + 3, { align: 'center' });
                
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(100, 100, 100);
                doc.text(`${vista} - Sin análisis`, analysisX, analysisY + imageHeight + 8);
              }
              
              // Actualizar posición Y para la siguiente fila
              currentRowY = originalY + imageHeight + rowSpacing;
              processedImages++;
              
            } catch (err) {
              console.warn(`Error al insertar imágenes de ${vista}:`, err);
              // En caso de error, seguir con la siguiente imagen
              currentRowY += imageHeight + rowSpacing;
              processedImages++;
            }
          }
        }

        // Actualizar currentY para el resto del documento
        currentY = currentRowY;

        // Información adicional
        if (tieneAnalisisIA) {
          currentY += 5;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(45, 123, 182);
          doc.text('💡 Las imágenes con análisis IA incluyen keypoints, líneas de referencia y mediciones automáticas.', 14, currentY);
          doc.setTextColor(0, 0, 0);
          currentY += 10;
        }

        if (imageCount > 4) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 100, 100);
          doc.text(`Nota: Se muestran las primeras 4 vistas de ${imageCount} imágenes disponibles.`, 14, currentY);
          doc.setTextColor(0, 0, 0);
        }
      }

      // ==================== PIE DE PÁGINA ====================
      console.log('Agregando pie de página...');
      const totalPages = doc.internal.getNumberOfPages();
      
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(14, pageHeight - 25, pageWidth - 14, pageHeight - 25);
        
        // Información del pie
        doc.text('Sistema de Análisis Postural Computarizado', 14, pageHeight - 18);
        doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 14, pageHeight - 12);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 14, pageHeight - 18, { align: 'right' });
        
        // NUEVO: Indicar si incluye análisis de IA
        if (tieneAnalisisIA) {
          doc.setTextColor(45, 123, 182);
          doc.text('Incluye análisis automatizado con IA', pageWidth / 2, pageHeight - 12, { align: 'center' });
          doc.setTextColor(100, 100, 100);
        }
        
        // Nota legal
        doc.setFontSize(7);
        doc.text('Este reporte es una herramienta de apoyo diagnóstico.', pageWidth / 2, pageHeight - 6, { align: 'center' });
      }

      // ==================== GUARDAR ARCHIVO ====================
      console.log('Guardando archivo PDF...');
      const fileName = `Reporte_${evaluation.nombre.replace(/\s+/g, '_')}_${new Date(evaluation.fecha).toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      console.log('=== PDF GENERADO EXITOSAMENTE DESDE MODAL ===');
      
    } catch (error) {
      console.error('=== ERROR EN PDF DESDE MODAL ===');
      console.error('Error:', error);
      alert(`Error al generar PDF: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Función para calcular IMC
  const calculateIMC = () => {
    if (evaluation.peso && evaluation.altura) {
      const imc = evaluation.peso / ((evaluation.altura / 100) ** 2);
      return imc.toFixed(1);
    }
    return evaluation.imc || null;
  };

  const getIMCCategory = (imc) => {
    if (!imc) return null;
    const imcValue = parseFloat(imc);
    if (imcValue < 18.5) return { category: 'Bajo peso', variant: 'info' };
    if (imcValue < 25) return { category: 'Normal', variant: 'success' };
    if (imcValue < 30) return { category: 'Sobrepeso', variant: 'warning' };
    return { category: 'Obesidad', variant: 'danger' };
  };

  const imc = calculateIMC();
  const imcInfo = getIMCCategory(imc);

  // Función para calcular completitud
  const calculateCompleteness = () => {
    let score = 0;
    let maxScore = 8;
    
    if (evaluation.nombre && evaluation.nombre !== 'No especificado') score += 1;
    if (evaluation.edad && evaluation.edad !== 'No especificada') score += 1;
    if (evaluation.peso) score += 1;
    if (evaluation.altura) score += 1;
    if (evaluation.genero) score += 1;
    if (evaluation.motivoConsulta) score += 1;
    if (Object.keys(imagenes).length > 0) score += 1;
    if (evaluation.observaciones) score += 1;
    
    return Math.round((score / maxScore) * 100);
  };

  // Función para calcular tiempo transcurrido
  const getTimeElapsed = () => {
    const now = new Date();
    const evaluationDate = new Date(evaluation.fecha);
    const diffMs = now - evaluationDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else {
      return 'Menos de 1 hora';
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <i className="fas fa-user-circle me-2"></i>
          Detalle de Evaluación - {evaluation.nombre}
          {/* NUEVO: Indicador de análisis de IA */}
          {tieneAnalisisIA && (
            <Badge bg="light" text="primary" className="ms-2">
              <i className="fas fa-robot me-1"></i>
              Con IA
            </Badge>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Tabs defaultActiveKey="patient-data" className="mb-3">
          {/* Pestaña: Datos del Paciente */}
          <Tab eventKey="patient-data" title={<><i className="fas fa-user me-2"></i>Datos del Paciente</>}>
            <Row>
              <Col md={6}>
                <Card className="h-100 border-primary">
                  <Card.Header className="bg-primary text-white">
                    <h6 className="mb-0">
                      <i className="fas fa-id-card me-2"></i>
                      Información Personal
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Nombre:</strong> {evaluation.nombre || 'No especificado'}
                    </div>
                    <div className="mb-3">
                      <strong>Edad:</strong> {evaluation.edad || 'No especificada'} años
                    </div>
                    <div className="mb-3">
                      <strong>Género:</strong> {evaluation.genero || 'No especificado'}
                    </div>
                    <div className="mb-3">
                      <strong>Ocupación:</strong> {evaluation.ocupacion || 'No especificada'}
                    </div>
                    <div className="mb-3">
                      <strong>Teléfono:</strong> {evaluation.telefono || 'No especificado'}
                    </div>
                    <div className="mb-3">
                      <strong>Email:</strong> {evaluation.email || 'No especificado'}
                    </div>
                    <div className="mb-3">
                      <strong>Actividad Física:</strong> {evaluation.actividad_fisica || 'No especificada'}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="h-100 border-info">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">
                      <i className="fas fa-weight me-2"></i>
                      Datos Antropométricos
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <strong>Peso:</strong> {evaluation.peso ? `${evaluation.peso} kg` : 'No especificado'}
                    </div>
                    <div className="mb-3">
                      <strong>Altura:</strong> {evaluation.altura ? `${evaluation.altura} cm` : 'No especificada'}
                    </div>
                    {imc && (
                      <div className="mb-3">
                        <strong>IMC:</strong> 
                        <Badge bg={imcInfo?.variant || 'secondary'} className="ms-2">
                          {imc} kg/m² - {imcInfo?.category || 'N/A'}
                        </Badge>
                      </div>
                    )}
                    <div className="mb-3">
                      <strong>Fecha de Evaluación:</strong> {new Date(evaluation.fecha).toLocaleDateString('es-ES')}
                    </div>
                    <div className="mb-3">
                      <strong>Hora:</strong> {new Date(evaluation.fecha).toLocaleTimeString('es-ES')}
                    </div>
                    
                    {/* NUEVO: Información del análisis de IA */}
                    {tieneAnalisisIA && (
                      <div className="mb-3">
                        <strong>Análisis de IA:</strong>
                        <Badge bg="success" className="ms-2">
                          <i className="fas fa-check me-1"></i>
                          {Object.keys(analisisIA).length} vista{Object.keys(analisisIA).length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Historia Clínica */}
            {(evaluation.motivoConsulta || evaluation.antecedentesMedicos || evaluation.medicamentos) && (
              <Row className="mt-4">
                <Col>
                  <Card className="border-warning">
                    <Card.Header className="bg-warning text-dark">
                      <h6 className="mb-0">
                        <i className="fas fa-notes-medical me-2"></i>
                        Historia Clínica
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      {evaluation.motivoConsulta && (
                        <div className="mb-3">
                          <strong>Motivo de Consulta:</strong>
                          <p className="mt-2 p-2 bg-light rounded">{evaluation.motivoConsulta}</p>
                        </div>
                      )}
                      {evaluation.antecedentesMedicos && (
                        <div className="mb-3">
                          <strong>Antecedentes Médicos:</strong>
                          <p className="mt-2 p-2 bg-light rounded">{evaluation.antecedentesMedicos}</p>
                        </div>
                      )}
                      {evaluation.medicamentos && (
                        <div className="mb-3">
                          <strong>Medicamentos Actuales:</strong>
                          <p className="mt-2 p-2 bg-light rounded">{evaluation.medicamentos}</p>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Observaciones */}
            {evaluation.observaciones && (
              <Row className="mt-4">
                <Col>
                  <Card className="border-secondary">
                    <Card.Header className="bg-secondary text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-clipboard-list me-2"></i>
                        Observaciones Clínicas
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="mb-0">{evaluation.observaciones}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}
          </Tab>

          {/* Pestaña: Alteraciones Posturales */}
          <Tab eventKey="deviations" title={<><i className="fas fa-exclamation-triangle me-2"></i>Alteraciones ({desviaciones.length})</>}>
            {desviaciones.length > 0 ? (
              <div>
                <Alert variant="info" className="mb-4">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Se identificaron {desviaciones.length} alteración(es) postural(es):</strong>
                </Alert>
                <Row>
                  {desviaciones.map((desviacion, index) => (
                    <Col md={6} lg={4} key={index} className="mb-3">
                      <Card className="h-100 border-warning">
                        <Card.Body className="text-center">
                          <i className="fas fa-exclamation-triangle text-warning fa-2x mb-2"></i>
                          <h6 className="card-title">{desviacion}</h6>
                          <Badge bg="warning" text="dark">
                            Detectada
                          </Badge>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <Alert variant="success" className="text-center">
                <i className="fas fa-check-circle fa-3x mb-3 d-block"></i>
                <h5>No se detectaron alteraciones posturales</h5>
                <p className="mb-0">
                  El paciente presenta una evaluación postural normal sin alteraciones significativas.
                </p>
              </Alert>
            )}
          </Tab>

          {/* NUEVA PESTAÑA: Análisis de IA */}
          {tieneAnalisisIA && (
            <Tab eventKey="ai-analysis" title={<><i className="fas fa-robot me-2"></i>Análisis IA ({Object.keys(analisisIA).length})</>}>
              <Alert variant="info" className="mb-4">
                <i className="fas fa-brain me-2"></i>
                <strong>Análisis automatizado completado para {Object.keys(analisisIA).length} vista{Object.keys(analisisIA).length !== 1 ? 's' : ''}:</strong>
              </Alert>
              
              <Row>
                {Object.entries(analisisIA).map(([vista, analisis], index) => (
                  <Col lg={6} key={index} className="mb-4">
                    <Card className="h-100 border-primary">
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">
                          <i className="fas fa-eye me-2"></i>
                          {vista}
                          {analisis.confidence && (
                            <Badge bg="light" text="primary" className="ms-2">
                              Confianza: {analisis.confidence}%
                            </Badge>
                          )}
                        </h6>
                      </Card.Header>
                      <Card.Body>
                        {/* Imagen con análisis */}
                        {analisis.analysisImage && (
                          <div className="text-center mb-3">
                            <Image
                              src={analisis.analysisImage}
                              alt={`Análisis IA - ${vista}`}
                              fluid
                              rounded
                              className="border"
                              style={{ 
                                maxHeight: '250px', 
                                width: '100%', 
                                objectFit: 'contain',
                                backgroundColor: '#f8f9fa'
                              }}
                            />
                            <small className="text-muted d-block mt-1">
                              Análisis automatizado con keypoints y mediciones
                            </small>
                          </div>
                        )}
                        
                        {/* Hallazgos del análisis */}
                        {analisis.summary && Array.isArray(analisis.summary) && analisis.summary.length > 0 && (
                          <div>
                            <h6 className="text-primary mb-2">Hallazgos automatizados:</h6>
                            {analisis.summary.map((hallazgo, idx) => (
                              <div key={idx} className="mb-2 p-2 bg-light rounded">
                                <div className="d-flex justify-content-between align-items-start">
                                  <small className="text-dark">
                                    <strong>{hallazgo.hallazgo}</strong>
                                  </small>
                                  <Badge 
                                    bg={
                                      hallazgo.severidad === 'Normal' ? 'success' :
                                      hallazgo.severidad === 'Leve' ? 'warning' :
                                      hallazgo.severidad === 'Moderada' ? 'orange' :
                                      'danger'
                                    }
                                    className="ms-2"
                                  >
                                    {hallazgo.severidad}
                                  </Badge>
                                </div>
                                <small className="text-muted">
                                  Valor: {hallazgo.valor} | Ref: {hallazgo.referencia}
                                </small>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Timestamp del análisis */}
                        {analisis.timestamp && (
                          <div className="mt-2">
                            <small className="text-muted">
                              <i className="fas fa-clock me-1"></i>
                              Analizado: {new Date(analisis.timestamp).toLocaleString('es-ES')}
                            </small>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>
          )}

          {/* Pestaña: Imágenes */}
          <Tab eventKey="images" title={<><i className="fas fa-images me-2"></i>Imágenes ({Object.keys(imagenes).length})</>}>
            {Object.keys(imagenes).length > 0 ? (
              <Row>
                {Object.entries(imagenes).map(([posicion, src]) => (
                  <Col lg={6} xl={4} key={posicion} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Header className="bg-light text-center">
                        <h6 className="mb-0 text-primary">
                          <i className="fas fa-camera me-2"></i>
                          {posicion}
                          {/* NUEVO: Indicador si tiene análisis de IA */}
                          {analisisIA[posicion] && (
                            <Badge bg="success" className="ms-2">
                              <i className="fas fa-robot me-1"></i>
                              IA
                            </Badge>
                          )}
                        </h6>
                      </Card.Header>
                      <Card.Body className="p-2">
                        <div className="text-center">
                          <Image
                            src={src}
                            alt={posicion}
                            fluid
                            rounded
                            className="border"
                            style={{ 
                              maxHeight: '300px', 
                              width: '100%', 
                              objectFit: 'contain',
                              backgroundColor: '#f8f9fa'
                            }}
                          />
                        </div>
                      </Card.Body>
                      <Card.Footer className="text-center bg-light">
                        <small className="text-muted">Vista {posicion.toLowerCase()}</small>
                        {/* NUEVO: Mostrar imagen con análisis si existe */}
                        {analisisIA[posicion] && analisisIA[posicion].analysisImage && (
                          <div className="mt-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => {
                                const newWindow = window.open();
                                newWindow.document.write(`
                                  <html>
                                    <head><title>Análisis IA - ${posicion}</title></head>
                                    <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f5f5f5;">
                                      <img src="${analisisIA[posicion].analysisImage}" style="max-width:90%; max-height:90%; object-fit:contain;" alt="Análisis IA - ${posicion}">
                                    </body>
                                  </html>
                                `);
                              }}
                            >
                              <i className="fas fa-robot me-1"></i>
                              Ver análisis IA
                            </Button>
                          </div>
                        )}
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="warning" className="text-center">
                <i className="fas fa-camera-retro fa-3x mb-3 d-block"></i>
                <h5>No hay imágenes disponibles</h5>
                <p className="mb-0">
                  No se cargaron imágenes durante esta evaluación.
                </p>
              </Alert>
            )}
          </Tab>

          {/* Pestaña: Resumen */}
          <Tab eventKey="summary" title={<><i className="fas fa-chart-pie me-2"></i>Resumen</>}>
            <Row>
              <Col md={8}>
                <Card className="border-info h-100">
                  <Card.Header className="bg-info text-white">
                    <h6 className="mb-0">
                      <i className="fas fa-clipboard-check me-2"></i>
                      Resumen de la Evaluación
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <div className="row mb-3">
                      <div className="col-4">
                        <div className="text-center p-3 bg-light rounded">
                          <div className="display-6 text-primary">{desviaciones.length}</div>
                          <small className="text-muted">Alteraciones detectadas</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center p-3 bg-light rounded">
                          <div className="display-6 text-success">{Object.keys(imagenes).length}</div>
                          <small className="text-muted">Imágenes capturadas</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="text-center p-3 bg-light rounded">
                          <div className="display-6 text-info">{Object.keys(analisisIA).length}</div>
                          <small className="text-muted">Análisis de IA</small>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong>Estado de la evaluación:</strong>
                      <Badge 
                        bg={desviaciones.length === 0 ? 'success' : desviaciones.length <= 2 ? 'warning' : 'danger'} 
                        className="ms-2"
                      >
                        {desviaciones.length === 0 ? 'Normal' : 
                         desviaciones.length <= 2 ? 'Requiere seguimiento' : 
                         'Requiere atención médica'}
                      </Badge>
                    </div>

                    <div className="mb-3">
                      <strong>Completitud de datos:</strong>
                      <div className="progress mt-2" style={{height: '8px'}}>
                        <div 
                          className="progress-bar bg-info" 
                          style={{width: `${calculateCompleteness()}%`}}
                        ></div>
                      </div>
                      <small className="text-muted">{calculateCompleteness()}% completo</small>
                    </div>

                    <div className="mb-3">
                      <strong>Tiempo transcurrido:</strong>
                      <span className="ms-2 text-muted">
                        {getTimeElapsed()} desde la evaluación
                      </span>
                    </div>

                    {/* NUEVO: Información del análisis de IA */}
                    {tieneAnalisisIA && (
                      <div className="mb-3">
                        <strong>Análisis automatizado:</strong>
                        <Alert variant="success" className="mt-2 mb-0">
                          <i className="fas fa-robot me-2"></i>
                          Se completó el análisis automatizado para {Object.keys(analisisIA).length} vista{Object.keys(analisisIA).length !== 1 ? 's' : ''}. 
                          Los resultados incluyen keypoints, mediciones y hallazgos clínicos automatizados.
                        </Alert>
                      </div>
                    )}

                    {desviaciones.length > 0 && (
                      <div className="mb-3">
                        <strong>Recomendación:</strong>
                        <Alert variant="warning" className="mt-2 mb-0">
                          <i className="fas fa-exclamation-triangle me-2"></i>
                          Se recomienda consulta con especialista en rehabilitación 
                          para evaluación clínica detallada de las alteraciones detectadas.
                        </Alert>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={4}>
                <Card className="border-success h-100">
                  <Card.Header className="bg-success text-white">
                    <h6 className="mb-0">
                      <i className="fas fa-download me-2"></i>
                      Acciones Disponibles
                    </h6>
                  </Card.Header>
                  <Card.Body className="d-grid gap-2">
                    <Button 
                      variant="danger" 
                      onClick={handleDownloadPDF}
                      className="shadow-sm"
                      disabled={isGeneratingPDF}
                    >
                      {isGeneratingPDF ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Generando PDF...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-file-pdf me-2"></i>
                          Descargar PDF Completo
                          {tieneAnalisisIA && (
                            <small className="d-block">
                              + Análisis de IA incluido
                            </small>
                          )}
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        const data = {
                          paciente: evaluation,
                          desviaciones: desviaciones,
                          imagenes: imagenes,
                          analisisIA: analisisIA, // NUEVO: Incluir análisis de IA
                          fechaExportacion: new Date().toISOString(),
                          metadatos: {
                            version: '2.0',
                            incluyeAnalisisIA: tieneAnalisisIA,
                            totalAnalisisIA: Object.keys(analisisIA).length
                          }
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], {
                          type: 'application/json'
                        });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `evaluacion_${evaluation.nombre?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="shadow-sm"
                    >
                      <i className="fas fa-download me-2"></i>
                      Exportar JSON
                      {tieneAnalisisIA && (
                        <small className="d-block">
                          Con datos de IA
                        </small>
                      )}
                    </Button>

                    <Button 
                      variant="outline-secondary" 
                      onClick={() => {
                        let resumen = `Evaluación Postural - ${evaluation.nombre}\n` +
                          `Fecha: ${new Date(evaluation.fecha).toLocaleDateString('es-ES')}\n` +
                          `Alteraciones: ${desviaciones.length > 0 ? desviaciones.join(', ') : 'Ninguna'}\n` +
                          `Observaciones: ${evaluation.observaciones || 'Ninguna'}`;
                        
                        // NUEVO: Agregar información del análisis de IA
                        if (tieneAnalisisIA) {
                          resumen += `\n\nAnálisis de IA: ${Object.keys(analisisIA).length} vista(s) analizadas`;
                          Object.entries(analisisIA).forEach(([vista, analisis]) => {
                            if (analisis.summary && analisis.summary.length > 0) {
                              resumen += `\n${vista}: ${analisis.summary.length} hallazgo(s)`;
                            }
                          });
                        }
                        
                        navigator.clipboard.writeText(resumen);
                        alert('Resumen copiado al portapapeles');
                      }}
                      className="shadow-sm"
                    >
                      <i className="fas fa-copy me-2"></i>
                      Copiar Resumen
                    </Button>

                    {/* NUEVO: Botón para exportar solo análisis de IA */}
                    {tieneAnalisisIA && (
                      <Button 
                        variant="outline-info" 
                        onClick={() => {
                          const aiData = {
                            paciente: evaluation.nombre,
                            fecha: evaluation.fecha,
                            analisisIA: analisisIA,
                            resumen: {
                              totalVistas: Object.keys(analisisIA).length,
                              totalHallazgos: Object.values(analisisIA).reduce((total, analisis) => {
                                return total + (analisis.summary ? analisis.summary.length : 0);
                              }, 0)
                            },
                            exportado: new Date().toISOString()
                          };
                          
                          const blob = new Blob([JSON.stringify(aiData, null, 2)], {
                            type: 'application/json'
                          });
                          const link = document.createElement('a');
                          link.href = URL.createObjectURL(blob);
                          link.download = `analisis_ia_${evaluation.nombre?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="shadow-sm"
                      >
                        <i className="fas fa-robot me-2"></i>
                        Exportar solo IA
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            <small className="text-muted">
              <i className="fas fa-calendar me-1"></i>
              Evaluación realizada el {new Date(evaluation.fecha).toLocaleDateString('es-ES')} 
              a las {new Date(evaluation.fecha).toLocaleTimeString('es-ES')}
              {/* NUEVO: Mostrar información del análisis de IA */}
              {tieneAnalisisIA && (
                <span className="text-primary ms-2">
                  <i className="fas fa-robot me-1"></i>
                  Con análisis automatizado
                </span>
              )}
            </small>
          </div>
          <div>
            <Button variant="outline-secondary" onClick={onClose} className="me-2">
              <i className="fas fa-times me-2"></i>
              Cerrar
            </Button>
            <Button 
              variant="outline-danger" 
              onClick={() => {
                if (window.confirm(`¿Está seguro de que desea eliminar la evaluación de ${evaluation.nombre}?`)) {
                  onDelete(evaluation.id);
                }
              }}
            >
              <i className="fas fa-trash me-2"></i>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default EvaluationDetailModal;