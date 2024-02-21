import Button from "./AdminButton";
import DynamicTable from "./AdminTable";
import React, { useState } from "react";
import getDataFunc from "./AdminGetData";
import useDateRange from "./AdminDateRange";
import generarExcelFunc from "./AdminGenerarXlsx";
import ContainerButtonsLeft from "./AdminButtonsLeft";
import SelectEmpresa from "./AdminSelectedEmpresas";

const Inicio = ({ mostrarMensaje }) => {
  const { formattedStartDate, formattedEndDate, renderDatePicker } =
    useDateRange();
  const [empresa, setEmpresa] = useState("");
  const [Opcion, setOpcion] = useState();
  const [SubOpcion, setSubOpcion] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const getData = async (Opcion, SubOpcion) => {
    setOpcion(Opcion);
    setSubOpcion(SubOpcion);

    if (Opcion && formattedStartDate && formattedEndDate) {
      const formData = new FormData();
      formData.append("startDate", formattedStartDate);
      formData.append("endDate", formattedEndDate);
      formData.append("Opcion", Opcion);
      formData.append("SubOpcion", SubOpcion);
      if (Opcion == 22) {
        if (SubOpcion == 0) {
          formData.append("empresa", 9001);
        } else if (SubOpcion == 1) {
          formData.append("empresa", empresa);
        }
      } else {
        formData.append("empresa", 277);
      }

      getDataFunc(
        "RP_Consultas05",
        formData,
        setIsLoading,
        setShowTable,
        setResults,
        mostrarMensaje
      );
    } else {
      mostrarMensaje(
        "Debe seleccionar todos los campos",
        "warning_notification"
      );
    }
  };

  const generarExcel = async () => {
    const url = "generar_excel";
    const data = new FormData();
    data.append("results", JSON.stringify(results));

    let fileName = "";
    if (Opcion == 19) {
      if (SubOpcion == 0) {
        fileName = `Informe Tiquetes Bello Sol SE`;
      } else if (SubOpcion == 1) {
        fileName = `InformeVentaOnlineBerlitur`;
      } else if (SubOpcion == 2) {
        fileName = `InformeTransaccionesCRyDB`;
      } else if (SubOpcion == 3) {
        fileName = `EstadisticasDePagoYVentaMercadoPago`;
      }
    } else if (Opcion == 22) {
      if (SubOpcion == 0) fileName = `InformeTiquetesBelloSolSE`;
      else if (SubOpcion == 1) fileName = `InformeTiquetesConvenioBolivariano`;
    }
    await generarExcelFunc(url, data, fileName, mostrarMensaje, setIsLoading);
  };

  // Handle of table dynamic
  const [showTable, setShowTable] = useState(false);
  let columns = [];

  if (Opcion == 19) {
    if (SubOpcion == 3) {
      columns = [
        { key: "EMPRESA", label: "EMPRESA", type: "text" },
        { key: "fechaGeneración", label: "FECHA GENERACION", type: "text" },
        { key: "importetotal", label: "IMPORTE TOTAL", type: "number" },
        { key: "EstadoDescripcion", label: "ESTADO DESCRIPCION", type: "text" },
        { key: "ticketIDExterno", label: "TICKET ID EXT", type: "text" },
        { key: "pasajeNumero", label: "N° PASAJE", type: "text" },
        { key: "importeOperacion", label: "IMPORTE OPERACION", type: "text" },
        { key: "opcionPago", label: "OPCION PAGO", type: "text" },
        { key: "medioPago", label: "MEDIO DE PAGO", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "AgenciaCajaID", label: "AGENCIA ID", type: "text" },
        { key: "agencia", label: "AGENCIA", type: "text" },
        { key: "taquillero", label: "TAQUILLERO", type: "text" },
        { key: "Canal", label: "CANAL", type: "text" },
      ];
    } else if (SubOpcion == 2) {
      columns = [
        { key: "EMPRESA", label: "EMPRESA", type: "text" },
        { key: "fechaGeneracion", label: "FECHA GENERACION", type: "text" },
        { key: "importeTotal", label: "IMPORTE TOTAL", type: "text" },
        { key: "EstadoDescripcion", label: "ESTADO DESCRIPCION", type: "text" },
        { key: "ticketIDExterno", label: "TICKET ID EXT", type: "text" },
        { key: "pasajenumero", label: "N° PASAJE", type: "text" },
        { key: "importeoperacion", label: "IMPORTE OPERACION", type: "text" },
        { key: "opcionPago", label: "OPCION PAGO", type: "text" },
        { key: "medioPago", label: "MEDIO DE PAGO", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "AgenciaCajaID", label: "AGENCIA ID", type: "text" },
        { key: "Agencia", label: "AGENCIA", type: "text" },
        { key: "Taquillero", label: "TAQUILLERO", type: "text" },
      ];
    } else if (SubOpcion == 0) {
      columns = [
        { key: "EMPRESA", label: "EMPRESA", type: "text" },
        { key: "fechaGeneracion", label: "FECHA GENERACION", type: "text" },
        { key: "importetotal", label: "IMPORTE TOTAL", type: "text" },
        { key: "Estadodescripcion", label: "ESTADO DESCRIPCION", type: "text" },
        { key: "ticketIDExterno", label: "TICKET ID EXT", type: "text" },
        { key: "pasajenumero", label: "N° PASAJE", type: "text" },
        { key: "importeoperacion", label: "IMPORTE OPERACION", type: "number" },
        { key: "opcionPago", label: "OPCION PAGO", type: "text" },
        { key: "medioPago", label: "MEDIO DE PAGO", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "AgenciaCajaID", label: "AGENCIA ID", type: "text" },
        { key: "agencia", label: "AGENCIA", type: "text" },
        { key: "taquillero", label: "TAQUILLERO", type: "text" },
      ];
    }
  } else if (Opcion == 22) {
    if (SubOpcion == 0) {
      columns = [
        { key: "NEC", label: "NEC", type: "text" },
        { key: "FechaCompra", label: "FECHA COMPRA", type: "text" },
        { key: "AGENCIA", label: "AGENCIA", type: "text" },
        { key: "TAQUILLERO", label: "TAQUILLERO", type: "text" },
        { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
        { key: "Valor", label: "VALOR", type: "number" },
        { key: "TPoCanal", label: "TPO CANAL", type: "text" },
        { key: "MedioPago", label: "MEDIO PAGO", type: "text" },
        { key: "Convenio", label: "CONVENIO", type: "text" },
        { key: "ORIGEN", label: "ORIGEN", type: "text" },
        { key: "DESTINO", label: "DESTINO", type: "text" },
        { key: "LINEA", label: "LINEA", type: "text" },
        { key: "ORIGENR", label: "ORIGENR", type: "text" },
        { key: "DESTINOR", label: "DESTINOR", type: "text" },
        { key: "VIAJE", label: "VIAJE", type: "number" },
        { key: "FECHAPARTIDA", label: "FECHA PARTIDA", type: "text" },
        { key: "BUS", label: "BUS", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
        { key: "APELLIDO", label: "APELLIDO", type: "text" },
        { key: "NOMBRES", label: "NOMBRES", type: "text" },
        { key: "EMAIL", label: "EMAIL", type: "text" },
        { key: "TELEFONOS", label: "TELEFONOS", type: "number" },
      ];
    } else if (SubOpcion == 1) {
      columns = [
        { key: "NEC", label: "NEC", type: "text" },
        { key: "FechaCompra", label: "FECHA COMPRA", type: "text" },
        { key: "AGENCIA", label: "AGENCIA", type: "text" },
        { key: "TAQUILLERO", label: "TAQUILLERO", type: "text" },
        { key: "PASAJENUMERO", label: "N° PASAJE", type: "text" },
        { key: "Valor", label: "VALOR", type: "text" },
        { key: "TPoCanal", label: "TPO CANAL", type: "text" },
        { key: "MedioPago", label: "MEDIO PAGO", type: "text" },
        { key: "Convenio", label: "CONVENIO", type: "text" },
        { key: "ORIGEN", label: "ORIGEN", type: "text" },
        { key: "DESTINO", label: "DESTINO", type: "text" },
        { key: "LINEA", label: "LINEA", type: "text" },
        { key: "ORIGENR", label: "ORIGENR", type: "text" },
        { key: "DESTINOR", label: "DESTINOR", type: "text" },
        { key: "VIAJE", label: "VIAJE", type: "number" },
        { key: "FECHAPARTIDA", label: "FECHA PARTIDA", type: "text" },
        { key: "BUS", label: "BUS", type: "text" },
        { key: "ESTADO", label: "ESTADO", type: "text" },
        { key: "DOCUMENTO", label: "DOCUMENTO", type: "text" },
        { key: "APELLIDO", label: "APELLIDO", type: "text" },
        { key: "NOMBRES", label: "NOMBRES", type: "text" },
        { key: "EMAIL", label: "EMAIL", type: "text" },
        { key: "TELEFONOS", label: "TELEFONOS", type: "number" },
      ];
    }
  }

  const updateTableData = (updatedData) => {
    setTableData(updatedData);
  };

  return (
    <div className="Efect">
      <h1 className="titulo_login">Informes de Tiquetes y Agencias</h1>
      <hr />
      <section className="contabilidad_section forms__box">
        <div className="content__dateDH">{renderDatePicker()}</div>
        <div className="buttons_rptos">
          <div className="options__box">
            {Button({
              label: "Tiquetes Bello Sol SE",
              isLoading,
              getData: () => getData(22, 0),
            })}
          </div>
          <div className="options__box">
            <div className="bottom_bolivariano">
              <SelectEmpresa
                empresa={empresa}
                onChange={(e) => {
                  setEmpresa(e.target.value);
                  setShowTable(false);
                }}
                allowedCodes={[277, 278, 9001]}
              />
            </div>
            {Button({
              label: "Convenio Bolivariano",
              isLoading,
              getData: () => getData(22, 1),
            })}
          </div>
          <div className="options__box">
            {Button({
              label: "Venta Online Berlitur",
              isLoading,
              getData: () => getData(19, 0),
            })}
          </div>
          <div className="options__box">
            {Button({
              label: "Transacciones Tarjetas CR y DB",
              isLoading,
              getData: () => getData(19, 2),
            })}
          </div>
          <div className="options__box">
            {Button({
              label: "Estadisticas de Link de Pago y Venta Online MP",
              isLoading,
              getData: () => getData(19, 3),
            })}
          </div>
        </div>
      </section>
      {showTable && (
        <div className="tablaFuecOD">
          <hr className="hr" />
          <div className="table_95p results__box">
            <DynamicTable
              data={results}
              columns={columns}
              itemsPerPage={50}
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
