import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUploader from './components/ImageUploader';
import DeviationChecklist from './components/DeviationChecklist';
import PatientForm from './components/PatientForm';
import ExportButton from './components/ExportButton';
import ExportPDFButton from './components/ExportPDFButton';
import EvaluationsList from './components/EvaluationsList';
import EvaluationDetailModal from './components/EvaluationDetailModal';
import PosturalAnalysisPanel from './components/PosturalAnalysisPanel';

function App() {
  const [images, setImages] = useState({});
  const [patientData, setPatientData] = useState({
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
  const [deviations, setDeviations] = useState([]);
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDeviation, setFilterDeviation] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  // Estado para guardar las imágenes con análisis de IA y sus resultados
  const [aiAnalysisResults, setAiAnalysisResults] = useState({});
  
  // NUEVO: Estado para monitorear el uso del almacenamiento
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    available: 0,
    percentage: 0
  });

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('evaluaciones')) || [];
      setEvaluaciones(data);
      updateStorageInfo();
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error);
      setEvaluaciones([]);
    }
  }, []);

  // NUEVA FUNCIÓN: Calcular uso del almacenamiento
  const updateStorageInfo = () => {
    try {
      let totalSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          totalSize += localStorage[key].length;
        }
      }
      
      // Estimar capacidad máxima (generalmente 5-10MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const percentage = (totalSize / maxSize) * 100;
      
      setStorageInfo({
        used: totalSize,
        available: maxSize - totalSize,
        percentage: Math.min(percentage, 100)
      });
    } catch (error) {
      console.error('Error al calcular almacenamiento:', error);
    }
  };

  // NUEVA FUNCIÓN: Limpiar automáticamente evaluaciones antiguas
  const cleanOldEvaluations = () => {
    try {
      const evaluacionesGuardadas = JSON.parse(localStorage.getItem('evaluaciones')) || [];
      
      if (evaluacionesGuardadas.length > 10) {
        // Mantener solo las 10 más recientes
        const evaluacionesRecientes = evaluacionesGuardadas
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 10);
        
        localStorage.setItem('evaluaciones', JSON.stringify(evaluacionesRecientes));
        setEvaluaciones(evaluacionesRecientes);
        
        alert(`Se eliminaron ${evaluacionesGuardadas.length - 10} evaluaciones antiguas para liberar espacio.`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al limpiar evaluaciones:', error);
      return false;
    }
  };

  const handlePatientDataChange = (newData) => {
    setPatientData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  // Función para manejar los resultados del análisis de IA
  const handleAIAnalysisComplete = (viewName, analysisData) => {
    console.log(`Análisis de IA completado para ${viewName}:`, analysisData);
    
    setAiAnalysisResults(prevResults => ({
      ...prevResults,
      [viewName]: {
        originalImage: analysisData.originalImage,
        analysisImage: analysisData.analysisImage,
        keypoints: analysisData.keypoints,
        summary: analysisData.summary,
        confidence: analysisData.confidence,
        timestamp: new Date().toISOString()
      }
    }));

    if (!window.posturalAnalysisResults) {
      window.posturalAnalysisResults = {};
    }
    window.posturalAnalysisResults[viewName] = analysisData.analysisImage;
  };

  // FUNCIÓN MEJORADA: Compresión más agresiva de imágenes
  const compressImage = (base64String, maxWidth = 400, quality = 0.5) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones más pequeñas
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          } else {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con mayor compresión
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.src = base64String;
    });
  };

  // NUEVA FUNCIÓN: Comprimir análisis de IA de forma más eficiente
  const compressAIAnalysis = async (analysisData, maxWidth = 300, quality = 0.4) => {
    try {
      const compressed = { ...analysisData };
      
      // Comprimir imagen de análisis más agresivamente
      if (analysisData.analysisImage) {
        compressed.analysisImage = await compressImage(analysisData.analysisImage, maxWidth, quality);
      }
      
      // No guardar imagen original en el análisis para ahorrar espacio
      delete compressed.originalImage;
      
      // Simplificar keypoints (solo las coordenadas esenciales)
      if (analysisData.keypoints && Array.isArray(analysisData.keypoints)) {
        compressed.keypoints = analysisData.keypoints.map(kp => ({
          part: kp.part,
          x: Math.round(kp.position.x),
          y: Math.round(kp.position.y),
          score: Math.round(kp.score * 100) / 100
        }));
      }
      
      return compressed;
    } catch (error) {
      console.warn('Error al comprimir análisis de IA:', error);
      return analysisData;
    }
  };

  const guardarEnLocalStorage = async () => {
    // Validaciones
    if (!patientData.nombre || patientData.nombre.trim() === '') {
      alert('Por favor, ingrese al menos el nombre del paciente antes de guardar.');
      return;
    }

    // Verificar espacio disponible
    updateStorageInfo();
    if (storageInfo.percentage > 85) {
      const shouldClean = window.confirm(
        'El almacenamiento está casi lleno. ¿Desea eliminar evaluaciones antiguas automáticamente?'
      );
      
      if (shouldClean) {
        const cleaned = cleanOldEvaluations();
        if (!cleaned) {
          alert('No hay evaluaciones suficientes para limpiar. Considere exportar datos y empezar de nuevo.');
          return;
        }
      } else {
        alert('Para guardar esta evaluación, necesita liberar espacio eliminando evaluaciones antiguas.');
        return;
      }
    }

    try {
      // Mostrar mensaje de procesamiento
      const originalButton = document.querySelector('button[onclick*="guardarEnLocalStorage"]');
      if (originalButton) {
        originalButton.disabled = true;
        originalButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Optimizando datos...';
      }

      console.log('=== INICIO DEL GUARDADO OPTIMIZADO ===');

      // Comprimir imágenes originales con mayor compresión
      const compressedImages = {};
      for (const [key, value] of Object.entries(images)) {
        if (value) {
          try {
            console.log(`Comprimiendo imagen original: ${key}`);
            compressedImages[key] = await compressImage(value, 400, 0.6);
          } catch (error) {
            console.warn(`Error al comprimir imagen ${key}:`, error);
            // Usar versión muy reducida en caso de error
            compressedImages[key] = value.substring(0, 20000);
          }
        }
      }

      // Comprimir análisis de IA de forma más eficiente
      const compressedAIAnalysis = {};
      for (const [viewName, analysisData] of Object.entries(aiAnalysisResults)) {
        if (analysisData && analysisData.analysisImage) {
          try {
            console.log(`Comprimiendo análisis IA: ${viewName}`);
            compressedAIAnalysis[viewName] = await compressAIAnalysis(analysisData);
          } catch (error) {
            console.warn(`Error al comprimir análisis IA ${viewName}:`, error);
            // Versión mínima en caso de error
            compressedAIAnalysis[viewName] = {
              summary: analysisData.summary || [],
              confidence: analysisData.confidence || 0,
              timestamp: analysisData.timestamp || new Date().toISOString()
            };
          }
        }
      }

      const nuevaEvaluacion = {
        id: Date.now(),
        // Datos del paciente (solo los esenciales)
        nombre: patientData.nombre || 'No especificado',
        edad: patientData.edad || 'No especificada',
        peso: patientData.peso || '',
        altura: patientData.altura || '',
        genero: patientData.genero || '',
        ocupacion: patientData.ocupacion || '',
        telefono: patientData.telefono || '',
        email: patientData.email || '',
        
        // Solo incluir campos de historia clínica si tienen contenido
        ...(patientData.motivoConsulta && { motivoConsulta: patientData.motivoConsulta }),
        ...(patientData.antecedentesMedicos && { antecedentesMedicos: patientData.antecedentesMedicos }),
        ...(patientData.medicamentos && { medicamentos: patientData.medicamentos }),
        ...(patientData.actividad_fisica && { actividad_fisica: patientData.actividad_fisica }),
        ...(patientData.observaciones && { observaciones: patientData.observaciones }),
        
        // Datos de la evaluación
        desviaciones: deviations || [],
        imagenes: compressedImages,
        
        // Análisis de IA optimizado
        analisisIA: compressedAIAnalysis,
        tieneAnalisisIA: Object.keys(compressedAIAnalysis).length > 0,
        
        fecha: new Date().toISOString(),
        
        // IMC calculado
        imc: (patientData.peso && patientData.altura) ? 
          ((patientData.peso / ((patientData.altura / 100) ** 2)).toFixed(1)) : null,
          
        // Metadatos mínimos
        version: '2.1'
      };

      // Verificar tamaño de la evaluación individual
      const dataString = JSON.stringify(nuevaEvaluacion);
      const sizeInMB = new Blob([dataString]).size / (1024 * 1024);
      
      console.log(`Tamaño de la evaluación optimizada: ${sizeInMB.toFixed(2)} MB`);
      
      if (sizeInMB > 2) {
        alert('La evaluación sigue siendo muy grande. Intente con menos imágenes o reduzca la calidad.');
        return;
      }

      const evaluacionesGuardadas = JSON.parse(localStorage.getItem('evaluaciones')) || [];
      const actualizadas = [...evaluacionesGuardadas, nuevaEvaluacion];
      
      // Verificar tamaño total
      const totalDataString = JSON.stringify(actualizadas);
      const totalSizeInMB = new Blob([totalDataString]).size / (1024 * 1024);
      
      console.log(`Tamaño total del almacenamiento: ${totalSizeInMB.toFixed(2)} MB`);
      
      if (totalSizeInMB > 4) {
        // Intentar limpiar automáticamente
        const cleaned = cleanOldEvaluations();
        if (!cleaned) {
          alert('Almacenamiento lleno. Se necesita eliminar evaluaciones antiguas manualmente.');
          return;
        }
        
        // Intentar guardar después de limpiar
        const evaluacionesLimpias = JSON.parse(localStorage.getItem('evaluaciones')) || [];
        const actualizadasLimpias = [...evaluacionesLimpias, nuevaEvaluacion];
        localStorage.setItem('evaluaciones', JSON.stringify(actualizadasLimpias));
        setEvaluaciones(actualizadasLimpias);
      } else {
        localStorage.setItem('evaluaciones', totalDataString);
        setEvaluaciones(actualizadas);
      }
      
      updateStorageInfo();
      
      const mensaje = `✅ Evaluación de ${patientData.nombre} guardada exitosamente.\n` +
                     `📊 Datos: ${sizeInMB.toFixed(2)} MB\n` +
                     `🖼️ Imágenes: ${Object.keys(compressedImages).length}\n` +
                     `🤖 Análisis IA: ${Object.keys(compressedAIAnalysis).length}\n` +
                     `💾 Almacenamiento usado: ${storageInfo.percentage.toFixed(1)}%`;
      
      alert(mensaje);
      console.log('=== GUARDADO OPTIMIZADO EXITOSO ===');
      
    } catch (error) {
      console.error('Error al guardar evaluación:', error);
      if (error.name === 'QuotaExceededError') {
        alert('❌ Almacenamiento lleno. Use "Limpiar Almacenamiento" y intente nuevamente.');
      } else {
        alert('❌ Error al guardar. Intente con menos imágenes.');
      }
    } finally {
      // Restaurar botón
      const originalButton = document.querySelector('button[onclick*="guardarEnLocalStorage"]');
      if (originalButton) {
        originalButton.disabled = false;
        originalButton.innerHTML = '<i class="fas fa-database me-2"></i>Guardar Evaluación';
      }
    }
  };

  // NUEVA FUNCIÓN: Limpiar almacenamiento manualmente
  const limpiarAlmacenamiento = () => {
    const mensaje = `Uso actual del almacenamiento: ${storageInfo.percentage.toFixed(1)}%\n\n` +
                   `Opciones disponibles:\n` +
                   `1. Eliminar evaluaciones antiguas (recomendado)\n` +
                   `2. Limpiar todo el almacenamiento\n` +
                   `3. Exportar todo antes de limpiar`;
    
    const opcion = window.prompt(mensaje + '\n\nIngrese 1, 2 o 3:');
    
    switch(opcion) {
      case '1':
        const cleaned = cleanOldEvaluations();
        if (cleaned) {
          updateStorageInfo();
          alert('✅ Evaluaciones antiguas eliminadas exitosamente.');
        } else {
          alert('ℹ️ No hay suficientes evaluaciones para limpiar.');
        }
        break;
        
      case '2':
        if (window.confirm('⚠️ ¿Está seguro? Esto eliminará TODAS las evaluaciones guardadas.')) {
          localStorage.removeItem('evaluaciones');
          setEvaluaciones([]);
          updateStorageInfo();
          alert('✅ Almacenamiento limpiado completamente.');
        }
        break;
        
      case '3':
        exportarTodosLosDatos();
        break;
        
      default:
        alert('Operación cancelada.');
    }
  };

  // NUEVA FUNCIÓN: Exportar todos los datos
  const exportarTodosLosDatos = () => {
    try {
      const data = {
        evaluaciones: evaluaciones,
        fechaExportacion: new Date().toISOString(),
        version: '2.1',
        totalEvaluaciones: evaluaciones.length,
        metadatos: {
          sistemaGenerador: 'Sistema de Análisis Postural',
          tipoExportacion: 'Backup completo'
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `backup_completo_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('✅ Backup completo exportado. Ahora puede limpiar el almacenamiento si lo desea.');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('❌ Error al exportar los datos.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta evaluación?')) {
      try {
        const actualizadas = evaluaciones.filter((ev) => ev.id !== id);
        localStorage.setItem('evaluaciones', JSON.stringify(actualizadas));
        setEvaluaciones(actualizadas);
        setSelectedEvaluation(null);
        updateStorageInfo();
      } catch (error) {
        console.error('Error al eliminar evaluación:', error);
        alert('Error al eliminar la evaluación.');
      }
    }
  };

  const handleEdit = (updatedEval) => {
    try {
      const actualizadas = evaluaciones.map((ev) => (ev.id === updatedEval.id ? updatedEval : ev));
      localStorage.setItem('evaluaciones', JSON.stringify(actualizadas));
      setEvaluaciones(actualizadas);
      setSelectedEvaluation(null);
      updateStorageInfo();
    } catch (error) {
      console.error('Error al editar evaluación:', error);
      alert('Error al editar la evaluación.');
    }
  };

  const filteredEvaluaciones = evaluaciones.filter((ev) => {
    const matchesName = ev.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDeviation = filterDeviation
      ? (Array.isArray(ev.desviaciones)
          ? ev.desviaciones
          : JSON.parse(ev.desviaciones || '[]')
        ).includes(filterDeviation)
      : true;
    const matchesDate = filterDate
      ? new Date(ev.fecha).toISOString().split('T')[0] === filterDate
      : true;
    return matchesName && matchesDeviation && matchesDate;
  });

  const exportFilteredToPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Historial Filtrado de Evaluaciones', 14, 20);
      
      const rows = filteredEvaluaciones.map((e) => [
        e.nombre,
        e.edad,
        new Date(e.fecha).toLocaleString(),
        (Array.isArray(e.desviaciones)
          ? e.desviaciones
          : JSON.parse(e.desviaciones || '[]')
        ).join(', ') || 'Ninguna',
        e.tieneAnalisisIA ? 'Sí' : 'No'
      ]);
      
      doc.autoTable({
        head: [['Nombre', 'Edad', 'Fecha', 'Desviaciones', 'Análisis IA']],
        body: rows,
        startY: 30,
      });
      
      doc.save('historial_filtrado.pdf');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert('Error al exportar el PDF filtrado.');
    }
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    if (window.confirm('¿Está seguro de que desea limpiar todos los datos del formulario?')) {
      setPatientData({
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
      setDeviations([]);
      setImages({});
      setAiAnalysisResults({});
      setShowAnalysis(false);
      
      if (window.posturalAnalysisResults) {
        window.posturalAnalysisResults = {};
      }
    }
  };

  // Componente para mostrar información del almacenamiento
  const StorageIndicator = () => (
    <div className="alert alert-info mb-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <i className="fas fa-database me-2"></i>
          <strong>Almacenamiento:</strong> {storageInfo.percentage.toFixed(1)}% usado
        </div>
        <div>
          <div className="progress" style={{ width: '150px', height: '8px' }}>
            <div 
              className={`progress-bar ${
                storageInfo.percentage > 85 ? 'bg-danger' : 
                storageInfo.percentage > 60 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${storageInfo.percentage}%` }}
            ></div>
          </div>
        </div>
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={limpiarAlmacenamiento}
        >
          <i className="fas fa-broom me-1"></i>
          Limpiar
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4" style={{maxWidth: '1400px'}}>
      {/* Encabezado */}
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary mb-2">
          <i className="fas fa-user-md me-3"></i>
          Sistema de Evaluación Postural
        </h1>
        <p className="lead text-muted">
          Análisis computarizado con IA para apoyo a diagnostico de problemas posturales
        </p>
      </div>

      {/* Indicador de almacenamiento */}
      <StorageIndicator />

      {/* Formulario del Paciente */}
      <PatientForm setPatientData={handlePatientDataChange} />
      
      {/* Subida de Imágenes */}
      <ImageUploader images={images} setImages={setImages} />
      
      {/* Lista de Desviaciones */}
      <DeviationChecklist deviations={deviations} setDeviations={setDeviations} />

      {/* Botones de Exportación y Guardado */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-gradient-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-save me-2"></i>
                Exportar y Guardar Evaluación
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-2 mb-3">
                  <ExportButton 
                    images={images} 
                    patientData={patientData} 
                    deviations={deviations} 
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <ExportPDFButton 
                    images={images} 
                    patientData={patientData} 
                    deviations={deviations} 
                  />
                </div>
                <div className="col-md-2 mb-3">
                  <div className="text-center">
                    <button 
                      className="btn btn-warning btn-lg shadow-sm"
                      onClick={guardarEnLocalStorage}
                      disabled={!patientData.nombre || patientData.nombre.trim() === ''}
                    >
                      <i className="fas fa-database me-2"></i>
                      Guardar
                    </button>
                    <div className="mt-2">
                      <small className="text-muted">
                        {(!patientData.nombre || patientData.nombre.trim() === '') ? 
                          'Complete el nombre' :
                          'Almacenamiento optimizado'
                        }
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="text-center">
                    <button 
                      className="btn btn-outline-secondary btn-lg"
                      onClick={limpiarFormulario}
                    >
                      <i className="fas fa-broom me-2"></i>
                      Limpiar
                    </button>
                    <div className="mt-2">
                      <small className="text-muted">
                        Reiniciar formulario
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="text-center">
                    <button 
                      className="btn btn-info btn-lg"
                      onClick={exportarTodosLosDatos}
                    >
                      <i className="fas fa-download me-2"></i>
                      Backup
                    </button>
                    <div className="mt-2">
                      <small className="text-muted">
                        Exportar todo
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-3">
                  <div className="text-center">
                    <button 
                      className="btn btn-danger btn-lg"
                      onClick={limpiarAlmacenamiento}
                    >
                      <i className="fas fa-trash me-2"></i>
                      Limpiar BD
                    </button>
                    <div className="mt-2">
                      <small className="text-muted">
                        Liberar espacio
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Información sobre análisis de IA */}
              {(Object.keys(images).length > 0 || Object.keys(aiAnalysisResults).length > 0) && (
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="alert alert-info">
                      <div className="row">
                        <div className="col-md-4">
                          <i className="fas fa-images me-2"></i>
                          <strong>Imágenes originales:</strong> {Object.keys(images).length}
                        </div>
                        <div className="col-md-4">
                          <i className="fas fa-robot me-2"></i>
                          <strong>Análisis de IA:</strong> {Object.keys(aiAnalysisResults).length}
                        </div>
                        <div className="col-md-4">
                          <i className="fas fa-compress me-2"></i>
                          <strong>Compresión:</strong> Optimizada automáticamente
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros de Búsqueda */}
      <div className="card shadow-lg border-0 mb-4">
        <div className="card-header bg-gradient-info text-white">
          <h5 className="mb-0">
            <i className="fas fa-filter me-2"></i>
            Filtros de Búsqueda y Análisis
          </h5>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Buscar por nombre:</label>
              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Filtrar por fecha:</label>
              <input
                type="date"
                className="form-control shadow-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Filtrar por desviación:</label>
              <select
                className="form-select shadow-sm"
                value={filterDeviation}
                onChange={(e) => setFilterDeviation(e.target.value)}
              >
                <option value="">Todas las desviaciones...</option>
                <option value="Retroversión de cadera">Retroversión de cadera</option>
                <option value="Anteversión de cadera">Anteversión de cadera</option>
                <option value="Hipercifosis torácica">Hipercifosis torácica</option>
                <option value="Hiperlordosis lumbar">Hiperlordosis lumbar</option>
                <option value="Rectificación cervical">Rectificación cervical</option>
                <option value="Rectificación lumbar">Rectificación lumbar</option>
                <option value="Escoliosis funcional">Escoliosis funcional</option>
                <option value="Oblicuidad pélvica">Oblicuidad pélvica</option>
                <option value="Genu valgo">Genu valgo</option>
                <option value="Genu varo">Genu varo</option>
                <option value="Pie plano">Pie plano</option>
                <option value="Pie cavo">Pie cavo</option>
                <option value="Rotación interna de hombros">Rotación interna de hombros</option>
                <option value="Elevación unilateral de hombro">Elevación unilateral de hombro</option>
                <option value="Protracción de cabeza">Protracción de cabeza</option>
                <option value="Protrusión abdominal">Protrusión abdominal</option>
                <option value="Asimetría global">Asimetría global</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">&nbsp;</label>
              <div className="d-grid">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDate('');
                    setFilterDeviation('');
                  }}
                >
                  <i className="fas fa-eraser me-1"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <button 
                className="btn btn-primary me-2" 
                onClick={exportFilteredToPDF}
                disabled={filteredEvaluaciones.length === 0}
              >
                <i className="fas fa-file-pdf me-2"></i>
                Exportar Filtro a PDF
              </button>
            </div>
            <div className="col-md-6 text-end">
              <button 
                className="btn btn-success" 
                onClick={() => setShowAnalysis(!showAnalysis)}
                disabled={Object.values(images).filter(Boolean).length === 0}
              >
                <i className={`fas fa-${showAnalysis ? 'eye-slash' : 'robot'} me-2`}></i>
                {showAnalysis ? 'Ocultar Análisis IA' : 'Ver Análisis Postural (IA)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Análisis Postural con IA */}
      {showAnalysis && Object.values(images).some(Boolean) && (
        <PosturalAnalysisPanel 
          images={images} 
          onAnalysisComplete={handleAIAnalysisComplete}
        />
      )}

      {/* Lista de Evaluaciones */}
      <EvaluationsList
        evaluaciones={filteredEvaluaciones}
        onView={setSelectedEvaluation}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Modal de Detalle de Evaluación */}
      {selectedEvaluation && (
        <EvaluationDetailModal
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}

export default App;