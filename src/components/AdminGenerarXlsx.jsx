import axios from "axios";
import descargarArchivo from "./AdminDownloadXlsx";

const generarExcelFunc = async (
  url = "generar_excel",
  data,
  fileName,
  mostrarMensaje,
  setIsLoading
) => {
  setIsLoading(true);
  try {
    const response = await axios.post(
      `http://wsdx.berlinasdelfonce.com:9000/${url}/`,
      data,
      {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      }
    );

    descargarArchivo({ fileName, blob: response.data });
    setIsLoading(false);
  } catch (error) {
    mostrarMensaje("Error al generar el documento", "error_notification");
    setIsLoading(false);
  }
};

export default generarExcelFunc;
