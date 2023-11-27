import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("imageData", selectedFile);

    axios
      .post("http://127.0.0.1:8000/subir_ft/", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
        withCredentials: true,
        crossDomain: true,
        // Añade esto:
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
      })
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        // Aquí puedes manejar la respuesta del servidor como desees
      })
      .catch((error) => {
        console.error("Error al enviar la imagen:", error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Imagen</button>
    </div>
  );
};

export default UploadImage;
