import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

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

// PASO 2: Dentro de la función handleExportPDF, después de la sección de ANÁLISIS POSTURAL
// y antes de la sección de IMÁGENES, agregar esta nueva sección:

// ==================== ANÁLISIS DE CADENAS POSTURALES ====================
const selectedDeviations = deviations || [];
if (selectedDeviations && selectedDeviations.length > 0) {
    console.log('Agregando análisis de cadenas posturales...');
  
const chainAnalysis = analyzePosturalChains(selectedDeviations);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ANÁLISIS DE CADENAS POSTURALES', 14, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (chainAnalysis.predominantChain) {
    // Resultado principal
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 123, 182);
    doc.text(`PATRÓN PREDOMINANTE: ${chainAnalysis.predominantChain}`, 14, currentY);
    currentY += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Nivel de Predominancia: ${chainAnalysis.predominanceLevel} (${chainAnalysis.predominancePercentage}%)`, 14, currentY);
    currentY += 6;
    
    doc.text(`Alteraciones de esta cadena: ${chainAnalysis.maxCount} de ${chainAnalysis.totalDeviations} total`, 14, currentY);
    currentY += 10;
    
    // Descripción del patrón
    const descriptions = {
      'Cadena de Flexión (Retropulsada)': 'Patrón flexor global con desplazamiento posterior del centro de gravedad. Indica predominio del patrón flexor con tendencia al colapso postural.',
      'Cadena de Extensión (Antepulsada)': 'Patrón extensor global con desplazamiento anterior del centro de gravedad. Indica predominio del patrón extensor con compensaciones anteriores.',
      'Cadena de Apertura': 'Patrón de separación y rotación externa de estructuras corporales. Indica predominio del patrón de apertura con dispersión energética.',
      'Cadena de Cierre': 'Patrón de aproximación y rotación interna de estructuras corporales. Indica predominio del patrón de cierre con compresión estructural.',
      'Cadena de Inspiración': 'Patrón relacionado con la fase inspiratoria del ciclo respiratorio. Indica bloqueo en fase inspiratoria con restricción respiratoria.',
      'Cadena de Espiración': 'Patrón relacionado con la fase espiratoria del ciclo respiratorio. Indica bloqueo en fase espiratoria con limitación ventilatoria.'
    };
    
    const description = descriptions[chainAnalysis.predominantChain] || 'Patrón postural específico que requiere abordaje dirigido.';
    const descriptionLines = doc.splitTextToSize(description, pageWidth - 28);
    doc.text(descriptionLines, 14, currentY);
    currentY += descriptionLines.length * 4 + 8;
    
    // Distribución por cadenas (si hay múltiples)
    if (Object.keys(chainAnalysis.chainCounts).length > 1) {
      doc.setFont('helvetica', 'bold');
      doc.text('Distribución por Cadenas:', 14, currentY);
      currentY += 6;
      
      doc.setFont('helvetica', 'normal');
      Object.entries(chainAnalysis.chainCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([chain, count]) => {
          const percentage = ((count / chainAnalysis.totalDeviations) * 100).toFixed(1);
          const isMain = chain === chainAnalysis.predominantChain;
          
          if (isMain) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(45, 123, 182);
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
          }
          
          doc.text(`• ${chain}: ${count} alteración${count !== 1 ? 'es' : ''} (${percentage}%)`, 20, currentY);
          currentY += 5;
        });
      
      doc.setTextColor(0, 0, 0);
      currentY += 5;
    }
    
    // Interpretación clínica
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 123, 182);
    doc.text('INTERPRETACIÓN CLÍNICA:', 14, currentY);
    currentY += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    let interpretation = '';
    if (chainAnalysis.predominancePercentage >= 70) {
      interpretation = `Patrón Puro: La alta concentración de alteraciones (${chainAnalysis.predominancePercentage}%) en una sola cadena indica un patrón postural bien definido que requiere abordaje terapéutico específico y dirigido.`;
    } else if (chainAnalysis.predominancePercentage >= 50) {
      interpretation = `Patrón Mixto: Aunque existe una cadena predominante (${chainAnalysis.predominancePercentage}%), se observan compensaciones en otras cadenas que deben considerarse en el plan de tratamiento integral.`;
    } else {
      interpretation = `Patrón Complejo: Las alteraciones están distribuidas entre múltiples cadenas (${chainAnalysis.predominancePercentage}% predominancia), sugiriendo un patrón postural complejo que requiere evaluación y abordaje multidimensional.`;
    }
    
    const interpretationLines = doc.splitTextToSize(interpretation, pageWidth - 28);
    doc.text(interpretationLines, 14, currentY);
    currentY += interpretationLines.length * 4 + 10;
    
    // Recomendaciones terapéuticas
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 167, 69);
    doc.text('RECOMENDACIONES TERAPÉUTICAS:', 14, currentY);
    currentY += 6;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const treatments = {
      'Cadena de Flexión (Retropulsada)': 'Fortalecimiento de músculos extensores, estiramiento de flexores, reeducación postural con énfasis en la extensión vertebral y reeducación del patrón respiratorio.',
      'Cadena de Extensión (Antepulsada)': 'Fortalecimiento de flexores profundos, estiramiento de extensores superficiales, trabajo de estabilización central y control motor.',
      'Cadena de Apertura': 'Centralización corporal, fortalecimiento de músculos internos y estabilizadores, trabajo de integración y cohesión postural.',
      'Cadena de Cierre': 'Apertura de espacios articulares, fortalecimiento de músculos externos, descompresión estructural y movilización dirigida.',
      'Cadena de Inspiración': 'Reeducación respiratoria enfocada en la espiración, relajación de músculos inspiradores, movilización costal y diafragmática.',
      'Cadena de Espiración': 'Fortalecimiento de músculos inspiratorios, expansión torácica, trabajo de apertura y movilización respiratoria.'
    };
    
    const treatment = treatments[chainAnalysis.predominantChain] || 'Abordaje terapéutico individualizado según los hallazgos específicos del patrón postural identificado.';
    const treatmentLines = doc.splitTextToSize(treatment, pageWidth - 28);
    doc.text(treatmentLines, 14, currentY);
    currentY += treatmentLines.length * 4 + 15;
    
  } else {
    doc.text('No se identificó un patrón específico de cadenas posturales.', 14, currentY);
    currentY += 10;
  }
}

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

// ==================== ANÁLISIS POSTURAL CON CATEGORÍAS ====================
console.log('Agregando análisis postural...');
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text('ANÁLISIS POSTURAL POR CADENAS MUSCULARES', 14, currentY);
currentY += 10;

doc.setFontSize(10);
doc.setFont('helvetica', 'normal');

if (deviations && deviations.length > 0) {
  doc.text('Alteraciones identificadas por categorías:', 14, currentY);
  currentY += 8;

  // Función simple para obtener categoría
  const getCategory = (deviation) => {
    // Cadena de Flexión
    if (deviation.includes('Cifosis') || deviation.includes('Hipercifosis') || 
        deviation.includes('Rectificación lumbar') || deviation.includes('Retroversión') ||
        deviation.includes('Valgo de rodilla') || deviation.includes('posteriorizado')) {
      return 'Cadena de Flexión (Retropulsada)';
    }
    // Cadena de Extensión  
    if (deviation.includes('Anteversión') || deviation.includes('Hiperlordosis') ||
        deviation.includes('Rectificación cervical') || deviation.includes('anteriorizado') ||
        deviation.includes('Pie cavo')) {
      return 'Cadena de Extensión (Antepulsada)';
    }
    // Cadena de Apertura
    if (deviation.includes('Varo') || deviation.includes('Apertura') ||
        deviation.includes('rotación externa')) {
      return 'Cadena de Apertura';
    }
    // Cadena de Cierre
    if (deviation.includes('Pie plano') || deviation.includes('pronación') ||
        deviation.includes('Cierre') || deviation.includes('aducción')) {
      return 'Cadena de Cierre';
    }
    // Por defecto
    return 'Múltiples Cadenas';
  };

  deviations.forEach((deviation, index) => {
    const category = getCategory(deviation);
    
    // Mostrar alteración con su categoría
    doc.setFont('helvetica', 'normal');
    doc.text(`${index + 1}. ${deviation}`, 20, currentY);
    currentY += 4;
    
    // Mostrar categoría en color
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(45, 123, 182);
    doc.text(`    → ${category}`, 25, currentY);
    doc.setTextColor(0, 0, 0);
    currentY += 6;
  });
  
  currentY += 10;
  
  // Interpretación simple
  doc.setFillColor(248, 249, 250);
  doc.rect(14, currentY, pageWidth - 28, 15, 'F');
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 167, 69);
  doc.text('INTERPRETACIÓN: Las alteraciones identificadas sugieren patrones específicos', 18, currentY + 8);
  doc.text('que requieren abordaje terapéutico dirigido a reequilibrar las cadenas musculares.', 18, currentY + 12);
  doc.setTextColor(0, 0, 0);
  
  currentY += 20;
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