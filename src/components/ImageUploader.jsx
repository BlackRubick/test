import React, { useRef } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

function ImageUploader({ images, setImages }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageChange = (e, view) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => ({ ...prev, [view]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
    }
  };

  const takePhoto = (view) => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 300, 300);
    const dataURL = canvasRef.current.toDataURL('image/png');
    setImages((prev) => ({ ...prev, [view]: dataURL }));
  };

  const views = ['Frontal', 'Lateral Izquierda', 'Lateral Derecha', 'Posterior'];

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title>Subir o Tomar Imágenes</Card.Title>

        <Row>
          {views.map((view, index) => (
            <Col md={6} key={index} className="mb-3">
              <Form.Group>
                <Form.Label>{view}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, view)}
                  className="mb-2"
                />
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => takePhoto(view)}
                >
                  Tomar Foto
                </Button>

                {images[view] && (
                  <div className="mt-2">
                    <img
                      src={images[view]}
                      alt={view}
                      className="img-fluid border rounded"
                    />
                  </div>
                )}
              </Form.Group>
            </Col>
          ))}
        </Row>

        <div className="mt-4 text-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            width="300"
            height="300"
            className="border rounded"
          />
          <canvas ref={canvasRef} width="300" height="300" className="d-none" />
          <div className="mt-2">
            <Button variant="primary" onClick={startCamera}>
              Activar Cámara
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ImageUploader;
