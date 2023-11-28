import React, { useState, useRef } from "react";
import axios from "axios";

const UploadImage = ({ mostrarMensaje }) => {
  const videoRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCapture = () => {
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
  };

  const handleSnapshot = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "snapshot.png");
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file)); // Muestra la vista previa de la imagen
    }, "image/png");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      mostrarMensaje("No se ha capturado una imagen aún", "error_notification");
      return;
    }

    const formData = new FormData();
    formData.append("imageData", selectedFile);

    axios
      .post("http://127.0.0.1:8000/subir_ft/", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
        withCredentials: true,
        crossDomain: true,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
      })
      .then((response) => {
        mostrarMensaje(response.data.message, "success_notification");
      })
      .catch((error) => {
        mostrarMensaje("Error al enviar la imagen", "error_notification");
      });
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%", maxWidth: "400px" }} />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          style={{ width: "100%", maxWidth: "400px" }}
        />
      )}
      <div>
        <button onClick={handleCapture}>Abrir cámara</button>
        <button onClick={handleSnapshot}>Tomar foto</button>
        <button onClick={handleUpload}>Subir Imagen</button>
      </div>
    </div>
  );
};

export default UploadImage;
