import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

// Crear las funciones de categorización directamente aquí para evitar errores de importación
const deviationCategories = {
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
  'Pie en pronación': 'Cadena de Espiración',

  // ALTERACIONES GENERALES
  'Retroversión de cadera': 'Múltiples Cadenas',
  'Anteversión de cadera': 'Múltiples Cadenas',
  'Hipercifosis torácica': 'Múltiples Cadenas',
  'Escoliosis funcional': 'Múltiples Cadenas',
  'Oblicuidad pélvica': 'Múltiples Cadenas',
  'Genu valgo': 'Múltiples Cadenas',
  'Genu varo': 'Múltiples Cadenas',
  'Pie plano': 'Múltiples Cadenas',
  'Rotación interna de hombros': 'Múltiples Cadenas',
  'Elevación unilateral de hombro': 'Múltiples Cadenas',
  'Protracción de cabeza': 'Múltiples Cadenas',
  'Protrusión abdominal': 'Múltiples Cadenas',
  'Asimetría global': 'Múltiples Cadenas'
};

const getCategoryForDeviation = (deviation) => {
  return deviationCategories[deviation] || 'Sin Categorizar';
};

const getCategoryDescription = (category) => {
  const descriptions = {
    'Cadena de Flexión (Retropulsada)': 'Patrón postural caracterizado por flexión global y desplazamiento posterior del centro de gravedad',
    'Cadena de Extensión (Antepulsada)': 'Patrón postural caracterizado por extensión global y desplazamiento anterior del centro de gravedad',
    'Cadena de Apertura': 'Patrón postural caracterizado por separación y rotación externa de las estructuras corporales',
    'Cadena de Cierre': 'Patrón postural caracterizado por aproximación y rotación interna de las estructuras corporales',
    'Cadena de Inspiración': 'Patrón postural relacionado con la fase inspiratoria del ciclo respiratorio',
    'Cadena de Espiración': 'Patrón postural relacionado con la fase espiratoria del ciclo respiratorio',
    'Múltiples Cadenas': 'Alteración que puede presentarse en diferentes patrones posturales',
    'Sin Categorizar': 'Alteración postural que requiere clasificación específica'
  };
  return descriptions[category] || 'Descripción no disponible';
};

const groupDeviationsByCategory = (deviations) => {
  const grouped = {};
  deviations.forEach(deviation => {
    const category = getCategoryForDeviation(deviation);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(deviation);
  });
  return grouped;
};