import useDateMY from "./AdminMY";
import Button from "./AdminButton";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import DynamicTable from "./AdminTable";
import generarExcelFunc from "./AdminGenerarXlsx";
import SelectOptions from "./AdminSelectedOptions";
import ContainerButtonsLeft from "./AdminButtonsLeft";

const Inicio = ({ mostrarMensaje }) => {
  const { month, year, renderDateMY } = useDateMY({ setShowTable });
  const [tipoInforme, setTipoInforme] = useState(-1);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async () => {
    if (month && year && tipoInforme) {
      const formData = new FormData();
      formData.append("year", year);
      formData.append("month", month);
      formData.append("tipoInforme", tipoInforme);
      getDataFunc(
        "Rp_VF3",
        formData,
        setIsLoading,
        setShowTable,
        setResults,
        mostrarMensaje
      );
    } else {
      mostrarMensaje(
        "Debes seleccionar proporcionar todos los campos",
        "warning_notification"
      );
    }
  };

  const generarExcel = async () => {
    const data = new FormData();
    data.append("results", JSON.stringify(results));
    data.append("Opcion", tipoInforme);
    data.append("year", year);
    data.append("month", month);
    let fileName;
    if (tipoInforme == 0) {
      fileName = "EstadisticasViajeroFrecuenteBerlinas";
    } else if (tipoInforme == 1) {
      fileName = "EstadisticasViajeroFrecuenteServicioEspecial";
    } else if (tipoInforme == 2) {
      fileName = "EstadisticasViajeroFrecuenteDuo";
    } else if (tipoInforme == 3) {
      fileName = "ViajerosFrecuentes";
    } else if (tipoInforme == 4) {
      fileName = "TiqueteViajeroFrecuenteBerlinas";
    } else if (tipoInforme == 5) {
      fileName = "TiqueteViajeroFrecuenteServicioEspecial";
    } else if (tipoInforme == 6) {
      fileName = "TiqueteViajeroFrecuenteDuo";
    } else if (tipoInforme == 7) {
      fileName = "VentaOnline";
    } else if (tipoInforme == 8) {
      fileName = "ProspectoParaIngresarAViajeroFrecuente";
    }
    generarExcelFunc(
      "generarRptoConductores",
      data,
      fileName,
      mostrarMensaje,
      setIsLoading
    );
  };
  let columns = [];

  if (tipoInforme == 0 || tipoInforme == 1 || tipoInforme == 2) {
    columns = [
      { key: "concepto", label: "CONCEPTO", type: "text" },
      { key: "valor", label: "VALOR", type: "number" },
    ];
  } else if (tipoInforme == 3) {
    columns = [
      { key: "documento", label: "DOCUMENTO", type: "text" },
      { key: "apellido", label: "APELLIDO", type: "text" },
      { key: "Nombres", label: "NOMBRES", type: "text" },
      { key: "diaN", label: "DIA", type: "number" },
      { key: "mesN", label: "MES", type: "number" },
      { key: "YearN", label: "AÑO", type: "number" },
      { key: "TelCasa", label: "TEL CASA", type: "text" },
      { key: "TelOficina", label: "TEL OFICINA", type: "text" },
      { key: "TelCelular", label: "TEL CEL", type: "text" },
      { key: "email", label: "EMAIL", type: "text" },
      { key: "ResidenciaCiudad", label: "RESIDENCIA", type: "text" },
      { key: "KMA", label: "KMA", type: "number" },
      { key: "KMV", label: "KMV", type: "number" },
      { key: "KMC", label: "KMC", type: "number" },
      { key: "NRed", label: "NRed", type: "text" },
      { key: "Ultima_Transaccion", label: "ULTIMA TRANSACCION", type: "text" },
      { key: "Servicio", label: "SERVICIO", type: "text" },
    ];
  } else if (tipoInforme == 4) {
    columns = [
      { key: "Year", label: "AÑO", type: "text" },
      { key: "Mes", label: "MES", type: "text" },
      { key: "Dia", label: "DIA", type: "text" },
      { key: "Numero", label: "NUMERO", type: "text" },
      { key: "Clase_Tiquete", label: "CLASE TIQUETE", type: "text" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "Oficina", label: "OFICINA", type: "text" },
      { key: "Taquillero", label: "TAQUILLERO", type: "text" },
      { key: "Fecha_Partida", label: "FECHA PARTIDA", type: "text" },
      { key: "Documento", label: "DOCUMENTO", type: "text" },
      { key: "Pasajero", label: "PASAJERO", type: "text" },
      { key: "Abordo", label: "ABORDO", type: "text" },
    ];
  } else if (tipoInforme == 5 || tipoInforme == 6) {
    columns = [
      { key: "Year", label: "AÑO", type: "number" },
      { key: "Mes", label: "MES", type: "number" },
      { key: "Dia", label: "DIA", type: "text" },
      { key: "Numero", label: "NUMERO", type: "text" },
      { key: "Clase_Tiquete", label: "CLASE TIQUETE", type: "text" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "Destino", label: "DESTINO", type: "text" },
      { key: "Oficina", label: "OFICINA", type: "text" },
      { key: "Taquillero", label: "TAQUILLERO", type: "text" },
      { key: "Fecha_Partida", label: "FECHA PARTIDA", type: "text" },
      { key: "Documento", label: "DOCUMENTO", type: "text" },
      { key: "Pasajero", label: "PASAJERO", type: "text" },
      { key: "Abordo", label: "ABORDO", type: "text" },
    ];
  } else if (tipoInforme == 7) {
    columns = [
      { key: "year", label: "AÑO", type: "number" },
      { key: "mes", label: "MES", type: "number" },
      { key: "dia", label: "DIA", type: "text" },
      { key: "FechaCompra", label: "FECHA COMPRA", type: "text" },
      { key: "hora", label: "HORA", type: "text" },
      { key: "minutos", label: "MINUTOS", type: "text" },
      { key: "Tiquete", label: "TIQUETE", type: "text" },
      { key: "Valor", label: "VALOR", type: "text" },
      { key: "Clase", label: "CLASE", type: "text" },
      { key: "Origen", label: "ORIGEN", type: "text" },
      { key: "DESTINO", label: "DESTINO", type: "text" },
      { key: "Oficina", label: "OFICINA", type: "text" },
      { key: "fecha_partida", label: "FECHA PARTIDA", type: "text" },
      { key: "documento", label: "DOCUMENTO", type: "text" },
      { key: "pasajero", label: "PASAJERO", type: "text" },
      { key: "Abordo", label: "ABORDO", type: "text" },
      { key: "medio_pago", label: "MEDIO PAGO", type: "text" },
    ];
  } else if (tipoInforme == 8) {
    columns = [
      { key: "Fec_Solicitud", label: "FECHA SOLICITUD ", type: "number" },
      { key: "documento", label: "DOCUMENTO", type: "text" },
      { key: "apellido", label: "APELLIDO", type: "number" },
      { key: "Nombres", label: "NOMBRES", type: "text" },
      { key: "diaN", label: "DIA", type: "text" },
      { key: "mesN", label: "MES", type: "text" },
      { key: "YearN", label: "AÑO", type: "text" },
      { key: "TelCasa", label: "TEL CASA", type: "text" },
      { key: "TelOficina", label: "TEL OFICINA", type: "text" },
      { key: "TelCelular", label: "TEL CELULAR", type: "text" },
      { key: "email", label: "EMAIL", type: "text" },
      { key: "ResidenciaCiudad", label: "CIUDAD", type: "text" },
      { key: "VBLNA", label: "VBLNA", type: "text" },
      { key: "UTBLNA", label: "UTBLNA", type: "text" },
      { key: "VSE", label: "VSE", type: "text" },
      { key: "UTSE", label: "UTSE", type: "text" },
    ];
  }
  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Generador de reporte</h1>
      <hr />
      <section className="colum_table forms__box">
        <div className="input-container agg_colaborador">{renderDateMY()}</div>
        <SelectOptions
          value={tipoInforme}
          onChange={(e) => {
            setTipoInforme(e.target.value);
            setShowTable(false);
          }}
          options={[
            { value: "0", label: "Estadistica viajero frecuente Berlinas" },
            { value: "1", label: "Estadisticas VF servicio especial" },
            { value: "2", label: "Estadistica viajeros frecuente duo" },
            { value: "3", label: "Viajeros Frecuentes" },
            { value: "4", label: "Tiquete viajero frecuente berlinas" },
            {
              value: "5",
              label: "Tiquete viajero frecuente servicio especial",
            },
            { value: "6", label: "Tiquete viajero frecuente duo" },
            { value: "7", label: "Venta online" },
            {
              value: "8",
              label: "Prospecto para ingresar al programa viajero frecuente",
            },
          ]}
        />
        {Button({ isLoading, getData })}
      </section>
      {showTable && (
        <div className="tablaFuecOD results__box">
          <div className="table_95p">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={30}
              updatedData={updateTableData}
            />
          </div>
        </div>
      )}
      {ContainerButtonsLeft({ isLoading, showTable, generarExcel })}
    </div>
  );
};

export default Inicio;
