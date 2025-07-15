import React, { useEffect, useRef, useState } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import '@tensorflow/tfjs';

function PosturalAnalysis({ imageSrc, viewName = 'Frontal', onAnalysisComplete }) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [status, setStatus] = useState('Inicializando análisis...');
  const [summary, setSummary] = useState([]);
  const [keypoints, setKeypoints] = useState([]);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const analyze = async () => {
      try {
        setStatus('Cargando modelo de IA...');
        const net = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75
        });
        
        setStatus('Procesando imagen...');
        const imageElement = imageRef.current;
        const pose = await net.estimateSinglePose(imageElement, {
          flipHorizontal: false,
        });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Ajustar canvas al tamaño de la imagen
        const imgRect = imageElement.getBoundingClientRect();
        canvas.width = imgRect.width;
        canvas.height = imgRect.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Escalar keypoints según el tamaño del canvas
        const scaleX = canvas.width / imageElement.naturalWidth;
        const scaleY = canvas.height / imageElement.naturalHeight;
        
        const scaledKeypoints = pose.keypoints.map(kp => ({
          ...kp,
          position: {
            x: kp.position.x * scaleX,
            y: kp.position.y * scaleY
          }
        }));

        drawProfessionalAnalysis(scaledKeypoints, ctx);
        
        setKeypoints(scaledKeypoints);
        setStatus('✅ Análisis completado');
        
        const detecciones = detectarPosturaProfesional(scaledKeypoints, viewName);
        setSummary(detecciones.evaluaciones);
        setConfidence(detecciones.confianza);
        
        // NUEVA FUNCIONALIDAD: Capturar imagen con análisis para PDF
        setTimeout(() => {
          captureAnalysisForPDF(imageElement, canvas, viewName);
        }, 1000); // Esperar 1 segundo para asegurar que el dibujo esté completo
        
      } catch (error) {
        console.error('Error en análisis:', error);
        setStatus('❌ Error en el análisis');
      }
    };

    if (imageRef.current && imageSrc) {
      analyze();
    }
  }, [imageSrc, viewName]);

  // Nueva función para capturar la imagen con análisis
  const captureAnalysisForPDF = (imageElement, canvas, viewName) => {
    try {
      // Crear un canvas temporal que combine imagen original + análisis
      const combinedCanvas = document.createElement('canvas');
      const combinedCtx = combinedCanvas.getContext('2d');
      
      // Establecer el tamaño del canvas combinado
      combinedCanvas.width = canvas.width;
      combinedCanvas.height = canvas.height;
      
      // Dibujar la imagen original de fondo
      combinedCtx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      
      // Dibujar el análisis encima
      combinedCtx.drawImage(canvas, 0, 0);
      
      // Convertir a base64
      const analysisImageData = combinedCanvas.toDataURL('image/jpeg', 0.8);
      
      // Enviar al componente padre si existe la función callback
      if (onAnalysisComplete) {
        onAnalysisComplete(viewName, {
          originalImage: imageSrc,
          analysisImage: analysisImageData,
          keypoints: keypoints,
          summary: summary,
          confidence: confidence
        });
      }
      
      // También guardar en el almacenamiento global de análisis
      if (window.posturalAnalysisResults) {
        window.posturalAnalysisResults[viewName] = analysisImageData;
      } else {
        window.posturalAnalysisResults = { [viewName]: analysisImageData };
      }
      
      console.log(`Análisis capturado para ${viewName}`);
      
    } catch (error) {
      console.error('Error al capturar análisis:', error);
    }
  };

  const drawProfessionalAnalysis = (keypoints, ctx) => {
    // Configuración de colores profesionales
    const colors = {
      keypoint: '#FF6B6B',
      skeleton: '#4ECDC4',
      reference: '#45B7D1',
      warning: '#FFA726',
      normal: '#66BB6A'
    };

    // Dibujar líneas de referencia
    drawReferenceLines(ctx, colors.reference);
    
    // Dibujar keypoints con mejor estilo
    drawEnhancedKeypoints(keypoints, ctx, colors.keypoint);
    
    // Dibujar esqueleto mejorado
    drawEnhancedSkeleton(keypoints, ctx, colors);
    
    // Dibujar análisis específico por vista
    drawViewSpecificAnalysis(keypoints, ctx, colors);
  };

  const drawReferenceLines = (ctx, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    ctx.globalAlpha = 0.7;
    
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Línea vertical central
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    
    // Líneas horizontales de referencia (hombros, caderas, rodillas)
    const referenceLines = [0.25, 0.4, 0.6, 0.8]; // Posiciones relativas
    referenceLines.forEach(pos => {
      ctx.beginPath();
      ctx.moveTo(0, height * pos);
      ctx.lineTo(width, height * pos);
      ctx.stroke();
    });
    
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  };

  const drawEnhancedKeypoints = (keypoints, ctx, color) => {
    keypoints.forEach(({ position, score, part }) => {
      if (score > 0.6) {
        // Círculo exterior
        ctx.beginPath();
        ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Círculo interior
        ctx.beginPath();
        ctx.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // Borde del círculo
        ctx.beginPath();
        ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Etiqueta del punto (solo para puntos principales)
        if (['nose', 'leftShoulder', 'rightShoulder', 'leftHip', 'rightHip'].includes(part)) {
          ctx.fillStyle = '#333';
          ctx.font = 'bold 12px Arial';
          ctx.fillText(part.replace(/([A-Z])/g, ' $1').trim(), position.x + 15, position.y - 10);
        }
      }
    });
  };

  const drawEnhancedSkeleton = (keypoints, ctx, colors) => {
    const connections = [
      // Torso
      ['leftShoulder', 'rightShoulder', colors.skeleton, 4],
      ['leftShoulder', 'leftHip', colors.skeleton, 3],
      ['rightShoulder', 'rightHip', colors.skeleton, 3],
      ['leftHip', 'rightHip', colors.skeleton, 4],
      
      // Brazos
      ['leftShoulder', 'leftElbow', colors.skeleton, 3],
      ['rightShoulder', 'rightElbow', colors.skeleton, 3],
      ['leftElbow', 'leftWrist', colors.skeleton, 3],
      ['rightElbow', 'rightWrist', colors.skeleton, 3],
      
      // Piernas
      ['leftHip', 'leftKnee', colors.skeleton, 3],
      ['rightHip', 'rightKnee', colors.skeleton, 3],
      ['leftKnee', 'leftAnkle', colors.skeleton, 3],
      ['rightKnee', 'rightAnkle', colors.skeleton, 3],
    ];

    connections.forEach(([partA, partB, color, width]) => {
      const a = keypoints.find(k => k.part === partA && k.score > 0.6);
      const b = keypoints.find(k => k.part === partB && k.score > 0.6);
      
      if (a && b) {
        ctx.beginPath();
        ctx.moveTo(a.position.x, a.position.y);
        ctx.lineTo(b.position.x, b.position.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    });
  };

  const drawViewSpecificAnalysis = (keypoints, ctx, colors) => {
    const getPart = (name) => keypoints.find(k => k.part === name && k.score > 0.6);
    
    if (viewName === 'Frontal' || viewName === 'Posterior') {
      // Análisis de simetría
      const ls = getPart('leftShoulder');
      const rs = getPart('rightShoulder');
      const lh = getPart('leftHip');
      const rh = getPart('rightHip');
      
      if (ls && rs) {
        const shoulderAngle = Math.atan2(rs.position.y - ls.position.y, rs.position.x - ls.position.x) * (180 / Math.PI);
        const color = Math.abs(shoulderAngle) > 5 ? colors.warning : colors.normal;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(ls.position.x, ls.position.y);
        ctx.lineTo(rs.position.x, rs.position.y);
        ctx.stroke();
        
        // Mostrar ángulo con fondo
        const midX = (ls.position.x + rs.position.x) / 2;
        const midY = (ls.position.y + rs.position.y) / 2;
        
        // Fondo del texto
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(midX - 25, midY - 25, 50, 20);
        
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.abs(shoulderAngle).toFixed(1)}°`, midX, midY - 10);
        ctx.textAlign = 'start';
      }
    }
    
    if (viewName.includes('Lateral')) {
      // Análisis de alineación sagital
      const head = getPart('nose');
      const shoulder = getPart('leftShoulder') || getPart('rightShoulder');
      const hip = getPart('leftHip') || getPart('rightHip');
      
      if (head && shoulder && hip) {
        // Línea de plomada
        ctx.strokeStyle = colors.reference;
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 6]);
        ctx.beginPath();
        ctx.moveTo(hip.position.x, 0);
        ctx.lineTo(hip.position.x, ctx.canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Desviaciones de la línea de plomada
        const headDeviation = head.position.x - hip.position.x;
        const shoulderDeviation = shoulder.position.x - hip.position.x;
        
        // Mostrar desviaciones con fondo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 60);
        
        ctx.fillStyle = Math.abs(headDeviation) > 20 ? colors.warning : colors.normal;
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`Cabeza: ${Math.abs(headDeviation).toFixed(0)}px`, 15, 30);
        
        ctx.fillStyle = Math.abs(shoulderDeviation) > 20 ? colors.warning : colors.normal;
        ctx.fillText(`Hombro: ${Math.abs(shoulderDeviation).toFixed(0)}px`, 15, 50);
      }
    }
  };

  const detectarPosturaProfesional = (keypoints, vista) => {
    const evaluaciones = [];
    let confianzaTotal = 0;
    let contadorEvaluaciones = 0;

    const getPart = (name) => keypoints.find(k => k.part === name && k.score > 0.6);

    // Análisis específico por vista
    if (vista === 'Frontal' || vista === 'Posterior') {
      // Evaluación de hombros
      const ls = getPart('leftShoulder');
      const rs = getPart('rightShoulder');
      
      if (ls && rs) {
        const shoulderAngle = Math.atan2(rs.position.y - ls.position.y, rs.position.x - ls.position.x) * (180 / Math.PI);
        const shoulderDeviation = Math.abs(shoulderAngle);
        
        if (shoulderDeviation > 10) {
          evaluaciones.push({
            hallazgo: 'Desnivel de hombros significativo',
            valor: `${shoulderDeviation.toFixed(1)}°`,
            severidad: shoulderDeviation > 15 ? 'Alta' : 'Moderada',
            referencia: 'Normal: < 5°'
          });
        } else if (shoulderDeviation > 5) {
          evaluaciones.push({
            hallazgo: 'Leve asimetría de hombros',
            valor: `${shoulderDeviation.toFixed(1)}°`,
            severidad: 'Leve',
            referencia: 'Normal: < 5°'
          });
        } else {
          evaluaciones.push({
            hallazgo: 'Alineación normal de hombros',
            valor: `${shoulderDeviation.toFixed(1)}°`,
            severidad: 'Normal',
            referencia: 'Normal: < 5°'
          });
        }
        
        confianzaTotal += (ls.score + rs.score) / 2;
        contadorEvaluaciones++;
      }

      // Evaluación de pelvis
      const lh = getPart('leftHip');
      const rh = getPart('rightHip');
      
      if (lh && rh) {
        const hipAngle = Math.atan2(rh.position.y - lh.position.y, rh.position.x - lh.position.x) * (180 / Math.PI);
        const hipDeviation = Math.abs(hipAngle);
        
        if (hipDeviation > 8) {
          evaluaciones.push({
            hallazgo: 'Oblicuidad pélvica',
            valor: `${hipDeviation.toFixed(1)}°`,
            severidad: hipDeviation > 12 ? 'Alta' : 'Moderada',
            referencia: 'Normal: < 3°'
          });
        } else if (hipDeviation > 3) {
          evaluaciones.push({
            hallazgo: 'Leve desnivelación pélvica',
            valor: `${hipDeviation.toFixed(1)}°`,
            severidad: 'Leve',
            referencia: 'Normal: < 3°'
          });
        } else {
          evaluaciones.push({
            hallazgo: 'Alineación pélvica normal',
            valor: `${hipDeviation.toFixed(1)}°`,
            severidad: 'Normal',
            referencia: 'Normal: < 3°'
          });
        }
        
        confianzaTotal += (lh.score + rh.score) / 2;
        contadorEvaluaciones++;
      }
    }

    if (vista.includes('Lateral')) {
      // Evaluación sagital
      const head = getPart('nose');
      const shoulder = getPart('leftShoulder') || getPart('rightShoulder');
      const hip = getPart('leftHip') || getPart('rightHip');
      
      if (head && shoulder && hip) {
        // Análisis de postura adelantada de cabeza
        const headForwardPosture = Math.abs(head.position.x - shoulder.position.x);
        
        if (headForwardPosture > 30) {
          evaluaciones.push({
            hallazgo: 'Postura adelantada de cabeza',
            valor: `${headForwardPosture.toFixed(0)} px`,
            severidad: headForwardPosture > 50 ? 'Alta' : 'Moderada',
            referencia: 'Normal: alineación con hombro'
          });
        }
        
        // Análisis de postura de hombros
        const shoulderPosture = shoulder.position.x - hip.position.x;
        
        if (Math.abs(shoulderPosture) > 25) {
          evaluaciones.push({
            hallazgo: shoulderPosture > 0 ? 'Hombros anterorizados' : 'Hombros retrasados',
            valor: `${Math.abs(shoulderPosture).toFixed(0)} px`,
            severidad: Math.abs(shoulderPosture) > 40 ? 'Alta' : 'Moderada',
            referencia: 'Normal: alineación con cadera'
          });
        }
        
        confianzaTotal += (head.score + shoulder.score + hip.score) / 3;
        contadorEvaluaciones++;
      }
    }

    const confianza = contadorEvaluaciones > 0 ? (confianzaTotal / contadorEvaluaciones * 100) : 0;

    return {
      evaluaciones,
      confianza: confianza.toFixed(1)
    };
  };

  const getStatusColor = () => {
    if (status.includes('✅')) return 'text-success';
    if (status.includes('❌')) return 'text-danger';
    return 'text-primary';
  };

  const getSeverityBadge = (severidad) => {
    const badges = {
      'Normal': 'badge bg-success',
      'Leve': 'badge bg-warning text-dark',
      'Moderada': 'badge bg-orange text-white',
      'Alta': 'badge bg-danger'
    };
    return badges[severidad] || 'badge bg-secondary';
  };

  return (
    <div className="card shadow-lg border-0 mb-4">
      <div className="card-header bg-gradient-primary text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-search-plus me-2"></i>
            Análisis Postural - {viewName}
          </h5>
          {confidence > 0 && (
            <span className="badge bg-light text-primary">
              Confianza: {confidence}%
            </span>
          )}
        </div>
      </div>
      
      <div className="card-body p-4">
        <div className="row">
          {/* Imagen original */}
          <div className="col-lg-6">
            <div className="position-relative">
              <img
                ref={imageRef}
                src={imageSrc}
                alt={`Vista ${viewName}`}
                className="img-fluid rounded shadow-sm border"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                onLoad={() => setStatus('Imagen cargada, iniciando análisis...')}
              />
              <div className="position-absolute top-0 start-0 m-2">
                <span className="badge bg-dark bg-opacity-75">
                  {viewName}
                </span>
              </div>
            </div>
          </div>
          
          {/* Canvas con análisis */}
          <div className="col-lg-6">
            <div className="position-relative">
              <canvas
                ref={canvasRef}
                className="border rounded shadow-sm"
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  backgroundColor: 'rgba(248, 249, 250, 0.8)'
                }}
              />
              <div className="position-absolute top-0 start-0 m-2">
                <span className="badge bg-primary bg-opacity-90">
                  Análisis IA
                </span>
              </div>
            </div>
            
            <div className="mt-3">
              <h6 className={`${getStatusColor()} fw-bold`}>
                <i className="fas fa-info-circle me-1"></i>
                {status}
              </h6>
            </div>
          </div>
        </div>
        
        {/* Resultados del análisis */}
        {summary.length > 0 && (
          <div className="mt-4">
            <h6 className="text-primary mb-3">
              <i className="fas fa-clipboard-list me-2"></i>
              Hallazgos Clínicos
            </h6>
            <div className="row">
              {summary.map((hallazgo, idx) => (
                <div key={idx} className="col-md-6 mb-3">
                  <div className="card border-start border-4 border-primary h-100">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="card-title text-dark mb-1">
                          {hallazgo.hallazgo}
                        </h6>
                        <span className={getSeverityBadge(hallazgo.severidad)}>
                          {hallazgo.severidad}
                        </span>
                      </div>
                      <p className="card-text text-muted small mb-1">
                        <strong>Medición:</strong> {hallazgo.valor}
                      </p>
                      <p className="card-text text-muted small mb-0">
                        <strong>Referencia:</strong> {hallazgo.referencia}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PosturalAnalysis;