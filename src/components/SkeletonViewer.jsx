import React from 'react';

function SkeletonViewer({ keypoints }) {
  const SCALE = 0.5; // reducir a la mitad para que quepa
  const OFFSET_X = 0;
  const OFFSET_Y = 0;

  const pointStyle = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: 'red',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer'
  };

  const lineStyle = {
    position: 'absolute',
    height: '2px',
    backgroundColor: 'lime',
    transformOrigin: 'left center'
  };

  const validPoints = keypoints.filter(kp => kp.score > 0.5);

  const getPoint = (name) =>
    validPoints.find(p => p.part === name)?.position || null;

  const connections = [
    ['leftShoulder', 'rightShoulder'],
    ['leftShoulder', 'leftHip'],
    ['rightShoulder', 'rightHip'],
    ['leftHip', 'rightHip'],
    ['leftHip', 'leftKnee'],
    ['rightHip', 'rightKnee'],
    ['leftKnee', 'leftAnkle'],
    ['rightKnee', 'rightAnkle']
  ];

  const renderLine = (from, to, i) => {
    if (!from || !to) return null;

    const x1 = from.x * SCALE + OFFSET_X;
    const y1 = from.y * SCALE + OFFSET_Y;
    const x2 = to.x * SCALE + OFFSET_X;
    const y2 = to.y * SCALE + OFFSET_Y;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    return (
      <div
        key={`line-${i}`}
        style={{
          ...lineStyle,
          left: x1,
          top: y1,
          width: `${length}px`,
          transform: `rotate(${angle}deg) translateY(-50%)`
        }}
      />
    );
  };

  return (
    <div
      className="relative bg-white border rounded shadow-md"
      style={{ width: 300, height: 400, position: 'relative' }}
    >
      {validPoints.map((kp, index) => (
        <div
          key={index}
          title={`${kp.part} (${Math.round(kp.position.x)}, ${Math.round(kp.position.y)})`}
          style={{
            ...pointStyle,
            left: kp.position.x * SCALE + OFFSET_X,
            top: kp.position.y * SCALE + OFFSET_Y
          }}
        />
      ))}

      {connections.map(([p1, p2], i) =>
        renderLine(getPoint(p1), getPoint(p2), i)
      )}

      <p className="absolute bottom-2 left-2 text-xs text-gray-500">
        Esqueleto simplificado 🦴
      </p>
    </div>
  );
}

export default SkeletonViewer;
