import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const UploadImage = ({ mostrarMensaje, onRecognition }) => {
  const videoRef = useRef(null);
  const [reconocido, setReconocido] = useState(false);

  useEffect(() => {
    let intervalId;

    if (!reconocido) {
      intervalId = setInterval(captureAndSend, 3000); // Envia als imagenes cada 3 segundos
    }

    return () => {
      clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
      stopCamera();
    };
  }, [reconocido]); // Se ejecuta cuando cambia el estado de reconocido

  useEffect(() => {
    const video = videoRef.current;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => console.error("Error al acceder a la cámara:", err));
    }
  }, []);

  const captureAndSend = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "snapshot.png");
      sendImageToDjango(file);
    }, "image/png");
  };

  const sendImageToDjango = (file) => {
    const formData = new FormData();
    formData.append("imageData", file);

    axios
      .post("http://127.0.0.1:8000/subir_fto/", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
        withCredentials: true,
        crossDomain: true,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
      })
      .then((response) => {
        if (response.data.status == 200) {
          clearInterval(intervalId); // Detiene el intervalo después del reconocimiento
          console.log("aqui pase");
        } else {
          setReconocido(false); // Vuelve a capturar si no se reconoce
        }
        onRecognition(true);
        setReconocido(true); // Detiene la captura si se reconoce
        mostrarMensaje(response.data.message, "success_notification");
      })
      .catch((error) => {
        setReconocido(false); // Vuelve a capturar si hay un error
        mostrarMensaje("Error al enviar la imagen", "error_notification");
      });
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} />
    </div>
  );
};

export default UploadImage;
