import axios from "axios";

const getDataFunc = async (
  url,
  formData,
  setIsLoading,
  setShowTable,
  setResults,
  mostrarMensaje
) => {
  try {
    setIsLoading(true);
    if (setShowTable) {
      setShowTable(false);
    }
  } catch {}

  try {
    const response = await axios.post(
      `http://wsdx.berlinasdelfonce.com:9000/${url}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        crossDomain: true,
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
      }
    );

    if (response.status === 200) {
      try {
        if (response.data.results[0].length > 0) {
          setIsLoading(false);
          if (setShowTable) {
            setShowTable(true);
          }
          if (response.data.results.length > 1) {
            setResults(response.data.results);
            return response.data.results;
          } else {
            setResults(response.data.results[0]);
            return response.data.results[0];
          }
        } else {
          mostrarMensaje("Respuesta vacía", "warning_notification");
          setIsLoading(false);
          return [];
        }
      } catch {}
    }
  } catch (error) {
    mostrarMensaje("Respuesta no Exitosa", "error_notification");
    try {
      setIsLoading(false);
    } catch {}
    return [];
  }
};

export default getDataFunc;
