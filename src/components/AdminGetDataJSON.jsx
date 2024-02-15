import axios from "axios";

const getDataJSONFunc = async (
  url,
  formData,
  setIsLoading,
  setShowTable,
  setResults,
  mostrarMensaje
) => {
  setIsLoading(true);
  if (setShowTable) {
    setShowTable(false);
  }

  try {
    const response = await axios.post(
      `http://wsdx.berlinasdelfonce.com:9000/${url}/`,
      formData,
      {
        responseType: "json",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
      setResults(response.data.results);
      if (response.data.results) {
        setIsLoading(false);
        if (setShowTable) {
          setShowTable(true);
        }
      } else {
        mostrarMensaje("Respuesta vacía", "warning_notification");
        setIsLoading(false);
        return [];
      }
    }
  } catch (error) {
    mostrarMensaje("Respuesta no Exitosa", "error_notification");
    setIsLoading(false);
    return [];
  }
};

export default getDataJSONFunc;
