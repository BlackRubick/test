import React from 'react';
import { Button } from 'react-bootstrap';

function ExportButton({ images, patientData, deviations }) {
  const handleExport = () => {
    try {
      const data = {
        paciente: patientData,
        desviaciones: deviations,
        imagenes: images,
        fechaExportacion: new Date().toISOString(),
        metadatos: {
          version: '1.0',
          sistemaGenerador: 'Sistema de Análisis Postural Computarizado'
        }
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evaluacion_${patientData.nombre?.replace(/\s+/g, '_') || 'paciente'}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Exportación JSON exitosa');
    } catch (error) {
      console.error('Error al exportar JSON:', error);
      alert('Error al exportar los datos. Verifique la consola para más detalles.');
    }
  };

  return (
    <div className="text-center">
      <Button 
        variant="outline-primary" 
        size="lg"
        onClick={handleExport}
        className="shadow-sm"
      >
        <i className="fas fa-download me-2"></i>
        Exportar Evaluación (JSON)
      </Button>
      <div className="mt-2">
        <small className="text-muted">
          Formato de intercambio de datos
        </small>
      </div>
    </div>
  );
}

export default ExportButton;