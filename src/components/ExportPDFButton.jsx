import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

function ExportPDFButton({ images, patientData, deviations }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    console.log('=== INICIO GENERACIÓN PDF ===');
    
    // Validación básica
    if (!patientData.nombre || patientData.nombre.trim() === '') {
      alert('Por favor, complete el nombre del paciente para generar el reporte.');
      return;
    }

    setIsGenerating(true);
    console.log('Estado: Iniciando generación...');

    try {
      // Importar jsPDF de forma directa
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

      // ==================== DATOS BÁSICOS ====================
      console.log('Agregando datos del paciente...');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('DATOS DEL PACIENTE', 14, currentY);
      currentY += 10;

      // Datos básicos sin tabla (más simple)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      doc.setFont('helvetica', 'bold');
      doc.text('Nombre:', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(patientData.nombre || 'No especificado', 50, currentY);
      currentY += 6;

      doc.setFont('helvetica', 'bold');
      doc.text('Edad:', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(`${patientData.edad || 'No especificada'} años`, 50, currentY);
      currentY += 6;

      if (patientData.genero) {
        doc.setFont('helvetica', 'bold');
        doc.text('Género:', 14, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(patientData.genero, 50, currentY);
        currentY += 6;
      }

      if (patientData.peso) {
        doc.setFont('helvetica', 'bold');
        doc.text('Peso:', 14, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(`${patientData.peso} kg`, 50, currentY);
        currentY += 6;
      }

      if (patientData.altura) {
        doc.setFont('helvetica', 'bold');
        doc.text('Altura:', 14, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(`${patientData.altura} cm`, 50, currentY);
        currentY += 6;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Fecha:', 14, currentY);
      doc.setFont('helvetica', 'normal');
      doc.text(new Date().toLocaleDateString('es-ES'), 50, currentY);
      currentY += 15;

      // ==================== OBSERVACIONES ====================
      if (patientData.observaciones) {
        console.log('Agregando observaciones...');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES', 14, currentY);
        currentY += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const obsLines = doc.splitTextToSize(patientData.observaciones, pageWidth - 28);
        doc.text(obsLines, 14, currentY);
        currentY += obsLines.length * 5 + 10;
      }

      // ==================== ALTERACIONES ====================
      console.log('Agregando análisis postural...');
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('ANÁLISIS POSTURAL', 14, currentY);
      currentY += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      if (deviations && deviations.length > 0) {
        doc.text('Alteraciones identificadas:', 14, currentY);
        currentY += 8;

        deviations.forEach((deviation, index) => {
          doc.text(`${index + 1}. ${deviation}`, 20, currentY);
          currentY += 5;
        });
        currentY += 5;
      } else {
        doc.setTextColor(0, 120, 0);
        doc.text('✓ No se identificaron alteraciones posturales significativas.', 14, currentY);
        currentY += 8;
        doc.setTextColor(0, 0, 0);
        doc.text('El paciente presenta una alineación postural normal.', 14, currentY);
        currentY += 10;
      }

      // ==================== IMÁGENES CON ANÁLISIS DE IA ====================
      const imagesList = images || {};
      const imageCount = Object.keys(imagesList).length;
      const analysisImages = window.posturalAnalysisResults || {};
      
      if (imageCount > 0) {
        console.log(`Procesando ${imageCount} imágenes...`);
        console.log('Análisis disponibles:', Object.keys(analysisImages));
        
        // Nueva página para imágenes si es necesario
        if (currentY > 160) {
          doc.addPage();
          currentY = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DOCUMENTACIÓN FOTOGRÁFICA CON ANÁLISIS IA', 14, currentY);
        currentY += 15;

        let processedImages = 0;
        const imageWidth = 85;
        const imageHeight = 65;
        const spacing = 10;

        // Procesar imágenes originales y con análisis
        for (const [vista, originalSrc] of Object.entries(imagesList)) {
          if (originalSrc && processedImages < 8) { // Máximo 8 imágenes (4 originales + 4 análisis)
            
            // Verificar espacio en página para el par de imágenes
            if (currentY + imageHeight + 40 > pageHeight - 30) {
              doc.addPage();
              currentY = 20;
            }

            try {
              // ===== IMAGEN ORIGINAL =====
              console.log(`Insertando imagen original ${vista}...`);
              
              // Marco de la imagen original
              doc.setDrawColor(200, 200, 200);
              doc.rect(13, currentY - 1, imageWidth + 2, imageHeight + 2);
              
              // Insertar imagen original
              doc.addImage(originalSrc, 'JPEG', 14, currentY, imageWidth, imageHeight);
              
              // Etiqueta de imagen original
              doc.setFontSize(9);
              doc.setFont('helvetica', 'bold');
              doc.text(`${vista} - Original`, 14, currentY + imageHeight + 8);
              
              // ===== IMAGEN CON ANÁLISIS IA =====
              const analysisImageSrc = analysisImages[vista];
              const analysisX = 14 + imageWidth + spacing;
              
              if (analysisImageSrc) {
                console.log(`Insertando análisis IA ${vista}...`);
                
                // Marco de la imagen con análisis
                doc.setDrawColor(45, 123, 182); // Color azul para análisis
                doc.setLineWidth(2);
                doc.rect(analysisX - 1, currentY - 1, imageWidth + 2, imageHeight + 2);
                doc.setLineWidth(1);
                
                // Insertar imagen con análisis
                doc.addImage(analysisImageSrc, 'JPEG', analysisX, currentY, imageWidth, imageHeight);
                
                // Etiqueta de análisis IA
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(45, 123, 182);
                doc.text(`${vista} - Análisis IA`, analysisX, currentY + imageHeight + 8);
                doc.setTextColor(0, 0, 0);
                
                // Agregar icono de IA
                doc.setFontSize(7);
                doc.setTextColor(45, 123, 182);
                doc.text('🤖 IA', analysisX + imageWidth - 15, currentY + 10);
                doc.setTextColor(0, 0, 0);
                
              } else {
                // Placeholder para análisis no disponible
                console.log(`Sin análisis IA para ${vista}`);
                doc.setFillColor(240, 240, 240);
                doc.rect(analysisX, currentY, imageWidth, imageHeight, 'F');
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text('Análisis IA', analysisX + imageWidth/2, currentY + imageHeight/2 - 5, { align: 'center' });
                doc.text('no disponible', analysisX + imageWidth/2, currentY + imageHeight/2 + 5, { align: 'center' });
                doc.setTextColor(0, 0, 0);
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text(`${vista} - Sin análisis`, analysisX, currentY + imageHeight + 8);
              }
              
              currentY += imageHeight + 25;
              processedImages++;
              
            } catch (err) {
              console.warn(`Error al insertar imágenes de ${vista}:`, err);
              
              // Placeholder simple en caso de error
              doc.setFillColor(240, 240, 240);
              doc.rect(14, currentY, imageWidth, imageHeight, 'F');
              doc.setFontSize(10);
              doc.setTextColor(100, 100, 100);
              doc.text('Error en imagen', 14 + imageWidth/2, currentY + imageHeight/2, { align: 'center' });
              doc.setTextColor(0, 0, 0);
              
              doc.setFontSize(9);
              doc.setFont('helvetica', 'bold');
              doc.text(`${vista} - Error`, 14, currentY + imageHeight + 8);
              
              currentY += imageHeight + 25;
              processedImages++;
            }
          }
        }

        // Información adicional sobre el análisis IA
        if (Object.keys(analysisImages).length > 0) {
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
          doc.text(`Nota: Se procesaron las primeras 4 vistas de ${imageCount} imágenes disponibles.`, 14, currentY);
          doc.setTextColor(0, 0, 0);
          currentY += 10;
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
        
        // Nota legal
        doc.setFontSize(7);
        doc.text('Este reporte es una herramienta de apoyo diagnóstico, el diagnóstico queda a interpretación del médico a quien corresponda.', pageWidth / 2, pageHeight - 6, { align: 'center' });
      }

      // ==================== GUARDAR ARCHIVO ====================
      console.log('Guardando archivo PDF...');
      const fileName = `Reporte_${patientData.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      console.log('=== PDF GENERADO EXITOSAMENTE ===');
      alert('PDF generado correctamente');
      
    } catch (error) {
      console.error('=== ERROR EN GENERACIÓN PDF ===');
      console.error('Tipo de error:', error.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      
      // Diferentes tipos de error
      if (error.message.includes('jsPDF')) {
        alert('Error: Problema al cargar la librería PDF. Recargue la página e intente nuevamente.');
      } else if (error.message.includes('import')) {
        alert('Error: Problema de importación. Verifique su conexión a internet.');
      } else if (error.message.includes('pageHeight') || error.message.includes('ReferenceError')) {
        alert('Error: Problema interno del PDF. Intente sin imágenes o recargue la página.');
      } else {
        alert(`Error al generar PDF: ${error.message}`);
      }
    } finally {
      setIsGenerating(false);
      console.log('Estado: Finalizando generación...');
    }
  };

  const isDisabled = !patientData.nombre || patientData.nombre.trim() === '' || isGenerating;

  return (
    <div className="text-center">
      <Button 
        variant="danger" 
        size="lg"
        onClick={handleExportPDF}
        disabled={isDisabled}
        className="shadow-sm"
      >
        {isGenerating ? (
          <>
            <i className="fas fa-spinner fa-spin me-2"></i>
            Generando PDF...
          </>
        ) : (
          <>
            <i className="fas fa-file-pdf me-2"></i>
            Generar Reporte (PDF)
          </>
        )}
      </Button>
      
      <div className="mt-2">
        <small className="text-muted">
          {isDisabled && !isGenerating ? 
            'Complete el nombre del paciente' :
            isGenerating ? 
            'Procesando reporte médico...' :
            'Reporte médico con imágenes incluidas'
          }
        </small>
      </div>

      {/* Información sobre imágenes */}
      {images && Object.keys(images).length > 0 && (
        <div className="mt-2">
          <small className="text-info">
            <i className="fas fa-images me-1"></i>
            {Object.keys(images).length} imagen{Object.keys(images).length !== 1 ? 'es' : ''} original{Object.keys(images).length !== 1 ? 'es' : ''}
            {window.posturalAnalysisResults && Object.keys(window.posturalAnalysisResults).length > 0 && (
              <span className="text-primary">
                <br />
                <i className="fas fa-robot me-1"></i>
                + {Object.keys(window.posturalAnalysisResults).length} análisis de IA incluido{Object.keys(window.posturalAnalysisResults).length !== 1 ? 's' : ''}
              </span>
            )}
          </small>
        </div>
      )}

      {/* Información sobre análisis IA */}
      {!window.posturalAnalysisResults && images && Object.keys(images).length > 0 && (
        <div className="mt-2">
          <small className="text-warning">
            <i className="fas fa-exclamation-triangle me-1"></i>
            Active el análisis IA primero para incluir interpretaciones automáticas
          </small>
        </div>
      )}

      {/* Botón de prueba adicional para debugging */}
      <div className="mt-3">
        <Button 
          variant="outline-info" 
          size="sm"
          onClick={() => {
            console.log('=== DIAGNÓSTICO ===');
            console.log('Datos del paciente:', patientData);
            console.log('Desviaciones:', deviations);
            console.log('Imágenes recibidas:', images);
            console.log('Número de imágenes:', images ? Object.keys(images).length : 0);
            console.log('Análisis IA disponibles:', window.posturalAnalysisResults);
            console.log('jsPDF disponible:', typeof window.jsPDF);
            
            // Verificar tamaño de imágenes
            if (images) {
              Object.entries(images).forEach(([vista, src]) => {
                if (src) {
                  const sizeInMB = (src.length * 3/4) / (1024 * 1024); // Aproximado para base64
                  console.log(`Imagen ${vista}: ~${sizeInMB.toFixed(2)} MB`);
                }
              });
            }
            
            alert('Revise la consola (F12) para ver el diagnóstico completo');
          }}
        >
          <i className="fas fa-bug me-1"></i>
          Diagnóstico
        </Button>
      </div>
    </div>
  );
}

export default ExportPDFButton;