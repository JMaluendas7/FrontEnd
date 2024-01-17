import React, { forwardRef } from "react";
import html2pdf from "html2pdf.js";
import "./crearPdf.css";
import axios from "axios";

// Import images
import logoMint from "/src/img/rpt_pdf/logo_mint.png";
import logoIso from "/src/img/rpt_pdf/logo_iso.png";
import logoBer from "/src/img/rpt_pdf/logo_ber.jpeg";
import logoTourline from "/src/img/rpt_pdf/logo-tourline.png";
import logoCit from "/src/img/rpt_pdf/logo_cit.png";
import logoSt from "/src/img/rpt_pdf/logo_st.png";
import firmaPjc from "/src/img/rpt_pdf/FIRMA_PJC.jpg";

class HTMLtoPDF extends React.Component {
  constructor(props) {
    super(props); // Llamado a la Super para obtener parametros
    this.datosForm3 = props.datosForm3;
    this.mostrarMensaje = props.mostrarMensaje;
    this.fechaSalida = props.fechaSalida;
    this.username = props.username;
    this.state = {
      downloadPDF: true, // Opción predeterminada: descargar el PDF
      editedFields: {}, // Para llevar la lista de campos editados
    };
    // Bind the functions to access 'this'
    this.handleDownloadPDF = this.handleDownloadPDF.bind(this);
    this.handlePrintPDF = this.handlePrintPDF.bind(this);

    if (!(this.fechaSalida instanceof Date)) {
      this.fechaSalida = new Date(this.fechaSalida);
    }

    this.editableStartDate = new Date(
      `${this.fechaSalida.getFullYear()}-${
        this.fechaSalida.getMonth() + 1
      }-${this.fechaSalida.getDate()} 00:00:00`
    ); // Fecha de inicio editable
    this.editableEndDate = new Date(
      `${this.fechaSalida.getFullYear()}-${
        this.fechaSalida.getMonth() + 1
      }-${this.fechaSalida.getDate()} ${this.fechaSalida.getHours()}:${this.fechaSalida.getMinutes()}:${this.fechaSalida.getSeconds()}`
    ); // Fecha de fin editable
  }

  sendPdf = async (pdfBlob, fileName) => {
    const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });

    const formData = new FormData();
    const modifiedFields = this.getModifiedFieldsString();
    const bus = this.datosForm3.Bus;
    const viaje = this.datosForm3.Viaje;
    const username = this.username;

    formData.append("pdf_file", pdfFile);
    formData.append("modifiedFields", modifiedFields);
    formData.append("bus", bus);
    formData.append("viaje", viaje);
    formData.append("username", username);

    try {
      const response = await axios.post(
        "http://wsdx.berlinasdelfonce.com:9000/saveRpto/",
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
      // this.mostrarMensaje(response.data.message, "success_notification");
    } catch (error) {
      // this.mostrarMensaje(response.data.message, "success_notification");
    }
  };

  convertToPDF = async () => {
    const element = document.getElementById("pdfContent");
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}_${
      currentDate.getMonth() + 1
    }_${currentDate.getFullYear()}-${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
    const nameApp = "5apps";
    const viaje = this.datosForm3.Viaje;
    const bus = this.datosForm3.Bus;

    const fileName = `${nameApp}_${bus}_${viaje}_${formattedDate}.pdf`;

    const opt = {
      margin: 10,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { format: "letter", orientation: "portrait" },
    };

    const pdf = html2pdf().from(element).set(opt);

    pdf
      .toPdf()
      .output("datauristring")
      .then((pdfString) => {
        const pdfBlob = this.dataURItoBlob(pdfString);

        try {
          if (this.state.downloadPDF) {
            pdf.save();
          } else {
            // Abrir una nueva ventana para imprimir el PDF
            const newWindow = window.open();
            if (newWindow !== null) {
              newWindow.document.open();
              newWindow.document.write(
                '<iframe id="pdfFrame" width="100%" height="100%" src="' +
                  URL.createObjectURL(pdfBlob) +
                  '"></iframe>'
              );
              newWindow.document.close();
              newWindow.onload = function () {
                const pdfFrame = newWindow.document.getElementById("pdfFrame");
                if (pdfFrame !== null) {
                  pdfFrame.contentWindow.print(); // Iniciar la impresión del documento dentro del iframe
                } else {
                  console.error("No se pudo encontrar el iframe");
                }
              };
            } else {
              console.error("No se pudo abrir una nueva ventana");
            }
          }
          // Envía el Blob
          this.sendPdf(pdfBlob, fileName);
        } catch (error) {
          console.error("Error al generar el PDF:", error);
        }
      });
  };

  // Transformacion de Pdf a Blob para guardar el Pdf en el BackEnd
  dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  // Cambiar el estado para alternar entre descargar o imprimir el PDF
  // Toggle download/print state
  toggleDownloadPDF = () => {
    this.setState(
      (prevState) => ({
        downloadPDF: !prevState.downloadPDF,
      }),
      () => {
        this.convertToPDF();
      }
    );
  };

  handleDownloadPDF = () => {
    this.setState({ downloadPDF: true }, () => {
      this.convertToPDF();
    });
  };

  handlePrintPDF = () => {
    this.setState({ downloadPDF: false }, () => {
      this.convertToPDF();
    });
  };

  // Define updateEditedFields como un método de la clase
  updateEditedFields = (fieldName) => {
    this.setState((prevState) => ({
      editedFields: {
        ...prevState.editedFields,
        [fieldName]: true, // Marca el campo como editado
      },
    }));
  };

  // Define handleFieldChange como un método de la clase
  handleFieldChange = (fieldName) => {
    // Actualiza el estado para registrar el campo editado
    if (!this.state.editedFields[fieldName]) {
      this.updateEditedFields(fieldName);
    }
  };

  getModifiedFieldsString = () => {
    const { editedFields } = this.state;
    const modifiedFields = Object.keys(editedFields).join(", ");
    return modifiedFields;
  };

  render() {
    // Obtener la fecha actual
    const currentDate = new Date();
    const isEditable =
      currentDate >= this.editableStartDate &&
      currentDate <= this.editableEndDate;

    // Pasar a formato DD/MM/YYYY)
    const formattedDate = `${currentDate.getDate()}/${
      currentDate.getMonth() + 1
    }/${currentDate.getFullYear()}`;

    const fechaP = new Date(this.datosForm3.FechaPartida);
    const diaP = fechaP.getDate();
    const mesP = fechaP.getMonth() + 1;
    const anioP = fechaP.getFullYear();

    const fecha = new Date(this.datosForm3.FechaPartida);
    const diaF = fecha.getDate();
    const mesF = fecha.getMonth() + 1;
    const anioF = fecha.getFullYear();

    const data = this.datosForm3.Consecutivo_FUEC;
    const regex = /(?:[^-]*-){2}([^-\s]*)/;
    const match = data.match(regex);

    const tercerNumero = match[1];

    return (
      <div>
        <div>
          <div id="pdfContent">
            <div className="content">
              <div className="container_content">
                <section className="banner__logos">
                  <img src={logoMint} />
                  <img src={logoIso} className="logo_iso" />
                  <hr className="hr_logos" />
                  {this.datosForm3.Nit_Emp == "860015624-1" && (
                    <img src={logoBer} />
                  )}
                  {this.datosForm3.Nit_Emp === "900622702-6" && (
                    <img src={logoTourline} />
                  )}
                  {this.datosForm3.Nit_Emp === "800204916-1" && (
                    <img src={logoCit} />
                  )}
                  <img src={logoSt} alt="f" />
                </section>
                <section className="title_doc">
                  <p className="title_con">
                    FORMATO ÚNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PÚBLICO
                    DE
                    <br />
                    TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL
                  </p>
                  <p
                    className="num_viaje"
                    onInput={() => this.handleFieldChange("Consecutivo_FUEC")}
                    contentEditable={isEditable}
                  >
                    N° <b>{this.datosForm3.Consecutivo_FUEC}</b>{" "}
                    <span className="fecha" contentEditable="false">
                      {formattedDate}
                    </span>
                  </p>
                </section>
                <section className="container_cont">
                  <div className="cont_a">
                    <div className="items">
                      <div className="item_name bold">RAZON SOCIAL</div>
                      <div
                        className="item_desc"
                        onInput={() =>
                          this.handleFieldChange("Empresa_Registrado")
                        }
                        contentEditable={isEditable}
                      >
                        {this.datosForm3.Empresa_Registrado}
                      </div>
                    </div>
                    <div className="items">
                      <div className="item_name bold">CONTRATO N°</div>
                      <div
                        className="item_desc"
                        contentEditable={isEditable}
                        onInput={() => this.handleFieldChange("tercerNumero")}
                      >
                        {tercerNumero}
                      </div>
                    </div>
                    <nav className="items">
                      <div className="item_name bold">CONTRATANTE</div>
                      <div
                        className="item_desc"
                        contentEditable={isEditable}
                        onInput={() => this.handleFieldChange("Nombre_Cliente")}
                      >
                        {this.datosForm3.Nombre_Cliente}
                      </div>
                    </nav>
                    <nav className="items">
                      <div className="item_name bold">OBJETO CONTRATO</div>
                      <div
                        className="item_desc"
                        contentEditable={isEditable}
                        onInput={() =>
                          this.handleFieldChange("Objeto_Contrato")
                        }
                      >
                        {this.datosForm3.Objeto_Contrato}
                      </div>
                    </nav>
                  </div>
                  <div className="cont_b">
                    <nav className="items">
                      <div className="item_nit bold">NIT</div>
                      <div
                        className="item_desc"
                        contentEditable={isEditable}
                        onInput={() => this.handleFieldChange("Nit_Emp")}
                      >
                        {this.datosForm3.Nit_Emp}
                      </div>
                    </nav>
                    <nav className="items">
                      <div className="item_nit bold">NIT</div>
                      <div
                        className="item_desc"
                        contentEditable={isEditable}
                        onInput={() => this.handleFieldChange("NIT_Cliente")}
                      >
                        {this.datosForm3.NIT_Cliente}
                      </div>
                    </nav>
                  </div>
                </section>
                <section className="containers">
                  <div className="item_name center bold">RECORRIDO</div>
                  <nav className="items">
                    <div className="item_name item_3rem bold">ORIGEN</div>
                    <div
                      className="item_desc"
                      contentEditable={isEditable}
                      onInput={() => this.handleFieldChange("Origen")}
                    >
                      {this.datosForm3.Origen}
                    </div>
                  </nav>
                  <nav className="items">
                    <div className="item_name item_3rem bold">DESTINO</div>
                    <div
                      className="item_desc"
                      contentEditable={isEditable}
                      onInput={() => this.handleFieldChange("Destino")}
                    >
                      {this.datosForm3.Destino}
                    </div>
                  </nav>
                  <div className="item_name item_name2 item_100 bold">
                    CONVENIO DE COLABORACION:
                  </div>
                </section>
                <section className="containers">
                  <div className="item_name center bold">
                    VIGENCIA DEL CONTRATO
                  </div>
                  <nav className="items">
                    <div className="item_name item_full bold">
                      FECHA INICIAL
                    </div>
                    <div className="item_name item_full">{diaP}</div>
                    <div className="item_name item_full">{mesP}</div>
                    <div className="item_name item_full">{anioP}</div>
                  </nav>
                  <nav className="items">
                    <div className="item_name item_full bold text_6">
                      FECHA DE VENCIMIENTO
                    </div>
                    <div className="item_name item_full">{diaF}</div>
                    <div className="item_name item_full">{mesF}</div>
                    <div className="item_name item_full">{anioF}</div>
                  </nav>
                </section>
                <section className="containers">
                  <div className="item_name center bold">
                    CARACTERISTICAS DEL VEHICULO
                  </div>
                  <nav className="items items_center line_rpt">
                    <div className="item_name item_full no_line bold">
                      PLACA
                    </div>
                    <div className="item_name item_full no_line bold">
                      MODELO
                    </div>
                    <div className="item_name item_full no_line bold">
                      MARCA
                    </div>
                    <div className="item_name item_full no_line bold">
                      CLASE
                    </div>
                  </nav>
                  <nav className="items items_center line_rpt">
                    <div
                      className="item_name item_full no_line"
                      contentEditable={isEditable}
                      onInput={() => this.handleFieldChange("Placa")}
                    >
                      {this.datosForm3.Placa}
                    </div>
                    <div
                      className="item_name item_full no_line"
                      contentEditable={isEditable}
                      onInput={() => this.handleFieldChange("Modelo")}
                    >
                      {this.datosForm3.Modelo}
                    </div>
                    <div
                      className="item_name item_full no_line"
                      contentEditable={isEditable}
                      onInput={() =>
                        this.handleFieldChange("Descripcion_Marca")
                      }
                    >
                      {this.datosForm3.Descripcion_Marca}
                    </div>
                    <div
                      className="item_name item_full no_line"
                      contentEditable={isEditable}
                      onInput={() =>
                        this.handleFieldChange("Descripcion_Clase")
                      }
                    >
                      {this.datosForm3.Descripcion_Clase}
                    </div>
                  </nav>
                  <nav className="items items_center no_line">
                    <div className="item_name item_full">
                      <div>
                        <strong>NUMERO INTERNO:</strong>{" "}
                        <span
                          contentEditable={isEditable}
                          onInput={() => this.handleFieldChange("Bus")}
                        >
                          {this.datosForm3.Bus}
                        </span>
                      </div>
                    </div>
                    <div className="item_name item_full">
                      <div>
                        <strong>NUMERO TARJETA OPERACION:</strong>{" "}
                        <span
                          contentEditable={isEditable}
                          onInput={() =>
                            this.handleFieldChange("Num_Tarjeta_Operacion")
                          }
                        >
                          {this.datosForm3.Num_Tarjeta_Operacion}
                        </span>
                      </div>
                    </div>
                  </nav>

                  <nav className="items items_center no_line">
                    <div className="item_name item_full item_table item_55"></div>
                    <div className="item_name item_full item_table text_6 item_table bold">
                      NOMBRES Y APELLIDOS
                    </div>
                    <div className="item_name item_full item_table bold text_8">
                      NUMERO DE CEDULA
                    </div>
                    <div className="item_name item_full item_table bold text_7">
                      LICENCIA DE CONDUCCION
                    </div>
                    <div className="item_name item_full item_table bold text_6">
                      VIGENCIA
                    </div>
                  </nav>
                  <nav className="items items_center no_line height_2rem">
                    <div className="item_name item_full item_table text_6 height_100 item_55 bold">
                      DATOS DEL CONDUCTOR
                    </div>
                    <div
                      className="item_name item_full item_table text_4 height_100 "
                      contentEditable={isEditable}
                      onInput={() =>
                        this.handleFieldChange(
                          "Apellido_Conductor1-Nombre_Conductor1"
                        )
                      }
                    >
                      {this.datosForm3.Apellido_Conductor1}{" "}
                      {this.datosForm3.Nombre_Conductor1}
                    </div>
                    <div
                      className="item_name item_full item_table height_100 "
                      contentEditable={isEditable}
                      onInput={() =>
                        this.handleFieldChange("Cedula_Conductor1")
                      }
                    >
                      {this.datosForm3.Cedula_Conductor1}
                    </div>
                    <div
                      className="item_name item_full item_table height_100 "
                      onInput={() => this.handleFieldChange("Pase1_Conductor1")}
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Pase1_Conductor1}
                    </div>
                    <div
                      className="item_name item_full item_table text_6 height_100 "
                      onInput={() =>
                        this.handleFieldChange("fechavencimiento1_Conductor1")
                      }
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.fechavencimiento1_Conductor1}
                    </div>
                  </nav>
                  <nav className="items items_center no_line height_2rem">
                    <div className="item_name item_full item_table height_100 text_6 item_55 bold">
                      DATOS DEL CONDUCTOR
                    </div>
                    <div
                      className="item_name item_full item_table height_100 text_4 "
                      onInput={() =>
                        this.handleFieldChange(
                          "Nombre_Conductor2-Apellido_Conductor2"
                        )
                      }
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Nombre_Conductor2}{" "}
                      {this.datosForm3.Apellido_Conductor2}
                    </div>
                    <div
                      className="item_name item_full item_table height_100 "
                      onInput={() =>
                        this.handleFieldChange("Cedula_Conductor2")
                      }
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Cedula_Conductor2}
                    </div>
                    <div
                      className="item_name item_full item_table height_100 "
                      onInput={() => this.handleFieldChange("Pase1_Conductor2")}
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Pase1_Conductor2}
                    </div>
                    <div
                      className="item_name item_full item_table text_6 height_100 "
                      onInput={() =>
                        this.handleFieldChange("fechavencimiento1_Conductor2")
                      }
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.fechavencimiento1_Conductor2}
                    </div>
                  </nav>
                </section>
                <section className="containers martop_02">
                  <nav className="items items_center no_line">
                    <div className="item_name item_full item_table item_55"></div>
                    <div className="item_name item_full item_table text_6 item_table bold">
                      NOMBRES Y APELLIDOS
                    </div>
                    <div className="item_name item_full item_table bold text_8">
                      NUMERO DE CEDULA
                    </div>
                    <div className="item_name item_full item_table bold">
                      TELEFONO
                    </div>
                    <div className="item_name item_full item_table text_6">
                      DIRECCION
                    </div>
                  </nav>
                  <nav className="items items_center no_line height_2rem">
                    <div className="item_name item_full item_table text_7 height_100 item_55 bold">
                      RESPONSABLE DEL CONTRATANTE
                    </div>
                    <div
                      className="item_name item_full item_table text_4 height_100 "
                      onInput={() =>
                        this.handleFieldChange("Rep_Nombres-Rep_Apellidos")
                      }
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Rep_Nombres}{" "}
                      {this.datosForm3.Rep_Apellidos}
                    </div>
                    <div
                      className="item_name item_full item_table height_100 "
                      onInput={() => this.handleFieldChange("Rep_cedula")}
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Rep_cedula}
                    </div>
                    <div
                      className="item_name item_full item_table text_6 height_100 "
                      onInput={() => this.handleFieldChange("Telefono_Cliente")}
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Telefono_Cliente}
                    </div>
                    <div
                      className="item_name item_full item_table text_6 height_100 "
                      onInput={() =>
                        this.handleFieldChange("Direccion_Cliente")
                      }
                      contentEditable={isEditable}
                    >
                      {this.datosForm3.Direccion_Cliente}
                    </div>
                  </nav>
                </section>
                <section className="container_text">
                  <p className="terms">
                    <strong>
                      Protocolo de Alistamiento Preventivo realizado según
                      resolución 315 del Ministerio de Transporte (06 de febrero
                      de 2013).
                    </strong>
                    <br />
                    El contratante y Berlinastur S.A., declaran que cuentan con
                    la autorización del responsable designado por parte del
                    contratante y del conductor(es), respectivamente, así como
                    las personas de las cuales en el futuro suministren
                    información personal, para transmitir su información a la
                    otra parte para efectos de gestionar y adelantar todas las
                    actividades concernientes a la prestación del servicio de
                    transporte terrestre contratado, el pago correspondiente y
                    establecer un canal de comunicación permanente durante la
                    ejecución de este contrato. Las partes tratarán información
                    bajo los lineamientos previstos en la Ley 1581 de 2012, el
                    Decreto 1377 de 2013 y su política de información personal.
                    La Política de Tratamiento de Datos Personales puede ser
                    consultada en www.berlinasdelfonce.com y su canal de
                    atención es proteccióndedatos@berlinasdelfonce.com.
                  </p>
                </section>
                <section className="containers">
                  <nav className="items items_center no_line height_5rem">
                    <div className="item_name item_full item_table height_5rem">
                      <p className="title_con">
                        <strong>
                          {this.datosForm3.dir_Emp} Tel.:{" "}
                          {this.datosForm3.tel_emp}
                        </strong>
                        {this.datosForm3.ema_emp}
                        <br />
                        <strong>{this.datosForm3.Ciudad_Empresa}</strong>
                      </p>
                    </div>
                    <div className="item_name item_full item_table height_5rem">
                      <div className="title_con">
                        {this.datosForm3.Nit_Emp === "860015624-1" && (
                          <img src={firmaPjc} alt="FIRMA GERENTE" />
                        )}
                        {this.datosForm3.Nit_Emp === "900622702-6" && (
                          <div>
                            <img src={firmaPjc} alt="FIRMA GERENTE" />
                            <img src={logoTourline} alt="Tourline" />
                          </div>
                        )}
                        {this.datosForm3.Nit_Emp === "800204916-1" && (
                          <img src={firmaPjc} alt="FIRMA GERENTE" />
                        )}
                        <hr className="hr_hor" />
                        Pedro José Cobos
                        <strong>FIRMA GERENTE</strong>
                      </div>
                    </div>
                  </nav>
                </section>
              </div>
              <footer className="footer">
                <h3>Pag 1/1</h3>
                <h3>
                  F-07-009 / Version 6 / 27-01-20F-07-009 / Version 6 / 27-01-2
                </h3>
                <h3>N° viaje: {this.datosForm3.Viaje}</h3>
              </footer>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <HTMLtoPDF {...props} ref={ref} />
));
