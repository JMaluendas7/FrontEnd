import useDate from "./AdminDate";
import Button from "./AdminButton";
import InputBus from "./AdminInputBus";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./PruebaTabla";
import React, { useState, useRef } from "react";
import getDataJSONFunc from "./AdminGetDataJSON";
import HTMLtoPDF from "./Reportes_RptoFuecCrearPdf";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Fuec = ({ mostrarMensaje, username }) => {
  const [fechaSalida, setFechaSalida] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showPdf, setShowDataPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFormI, setShowFormI] = useState(true);
  const [datosForm3, setDatosForm3] = useState([]);
  const { DateF, renderDatePicker1 } = useDate();
  const [bus, setbus] = useState("");

  const getData = async () => {
    if (bus) {
      const formData = new FormData();
      formData.append("bus", bus);
      formData.append("fecha", DateF);
      getDataFunc(
        "callViajes",
        formData,
        setIsLoading,
        setShowTable,
        setTableData,
        mostrarMensaje
      );
    } else {
      mostrarMensaje("Debes dar el numero de bus", "warning_notification");
    }
  };

  const enviarSubmitRpt = async (viaje, fecha) => {
    setFechaSalida(fecha);
    const formData = new FormData();
    formData.append("viaje", viaje);
    getDataJSONFunc(
      "callRptoViaje",
      formData,
      setIsLoading,
      setShowDataPdf,
      setDatosForm3,
      mostrarMensaje
    );
    setShowTable(false);
    setShowFormI(false);
  };

  const [tableData, setTableData] = useState([]);

  const columns = [
    { key: "viaje", label: "Viaje", type: "text" },
    { key: "fecha", label: "Fecha Partida", type: "text" },
    { key: "origen", label: "Origen", type: "text" },
    { key: "destino", label: "Destino", type: "text" },
  ];

  // Función para llamar la funcion de HTMLtoPDF
  const HTMLtoPDFRef = useRef(null);
  const PrintPDF = () => {
    if (HTMLtoPDFRef.current) {
      HTMLtoPDFRef.current.handlePrintPDF();
    } else {
      console.error("Ref del hijo no definida");
    }
  };
  const DownloadPDF = () => {
    if (HTMLtoPDFRef.current) {
      HTMLtoPDFRef.current.handleDownloadPDF();
    } else {
      console.error("Ref del hijo no definida");
    }
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login title_fuec">Reporte FUEC</h1>
      <hr />
      {showFormI && (
        <form className="forms__box" method="post">
          <div className="form__init">
            {InputBus({ bus, setbus })}
            {renderDatePicker1()}
            {Button({ label: "Buscar", isLoading, getData })}
          </div>
        </form>
      )}
      {showTable && (
        <div className="results__box">
          <DynamicTable
            data={tableData}
            columns={columns}
            itemsPerPage={10}
            enviarSubmitRpt={enviarSubmitRpt}
          />
        </div>
      )}
      {showPdf && (
        <>
          <section className="RptoFuec forms__box box__sheet">
            <HTMLtoPDF
              datosForm3={datosForm3}
              mostrarMensaje={mostrarMensaje}
              fechaSalida={fechaSalida}
              username={username}
              ref={HTMLtoPDFRef}
            />
          </section>
        </>
      )}
      {ContainerButtonsLeft({ isLoading, showPdf, DownloadPDF, PrintPDF })}
    </div>
  );
};

export default Fuec;
