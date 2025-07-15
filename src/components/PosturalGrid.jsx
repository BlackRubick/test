import React from 'react';

function PosturalGrid({ images }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Vista con Líneas de Referencia</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(images).map(([view, src]) => (
          <div key={view} className="relative border overflow-hidden">
            <img src={src} alt={view} className="w-full h-auto opacity-90" />
            {/* Líneas verticales */}
            {[...Array(9)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 border-l border-white opacity-50"
                style={{ left: `${(i + 1) * 10}%` }}
              ></div>
            ))}
            {/* Líneas horizontales */}
            {[...Array(9)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 border-t border-white opacity-50"
                style={{ top: `${(i + 1) * 10}%` }}
              ></div>
            ))}
            <p className="absolute top-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 font-medium rounded">
              {view}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PosturalGrid;
