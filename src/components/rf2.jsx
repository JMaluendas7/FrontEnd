import React, { useEffect, useRef } from "react";

const RealTimeFaceDetection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const video = videoRef.current;
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();

          // Función para inicializar la detección de rostros en tiempo real
          const detectFaces = async () => {
            const video = videoRef.current;
            const faceCascade = new cv.CascadeClassifier();
            const utils = new Utils("errorMessage");

            const faceCascadeFile = 'haarcascade_frontalface_default.xml'; // Ruta del archivo XML de cascada de Haar para detección de rostros

            // Cargar el archivo XML de la cascada de Haar
            utils.createFileFromUrl(faceCascadeFile, faceCascade.load);

            // Función para detectar rostros en cada fotograma
            const detectFace = () => {
              const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
              const gray = new cv.Mat();
              const faces = new cv.RectVector();

              video.srcObject.read(src);

              // Convertir el fotograma a escala de grises
              cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
              cv.equalizeHist(gray, gray);

              // Detectar rostros
              faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0);

              // Dibujar rectángulos alrededor de los rostros detectados
              for (let i = 0; i < faces.size(); ++i) {
                const face = faces.get(i);
                const point1 = new cv.Point(face.x, face.y);
                const point2 = new cv.Point(face.x + face.width, face.y + face.height);
                cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
              }

              // Mostrar el resultado en el canvas
              const canvas = document.getElementById("canvasOutput");
              utils.drawMat(src, canvas);

              src.delete();
              gray.delete();
              faces.delete();

              requestAnimationFrame(detectFace); // Realizar la detección en cada fotograma
            };

            detectFace(); // Iniciar la detección en cada fotograma
          };

          // Inicializar la detección de rostros en tiempo real
          detectFaces();
        })
        .catch((err) => console.error("Error al acceder a la cámara:", err));
    }
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas id="canvasOutput" width="640" height="480"></canvas>
    </div>
  );
};

export default RealTimeFaceDetection;
