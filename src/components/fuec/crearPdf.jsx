import React, { useEffect } from "react";
import html2pdf from "html2pdf.js";
import "./crearPdf.css";

class HTMLtoPDF extends React.Component {
  constructor(props) {
    super(props); // Llamado a la Super para obtener parametros

    this.datosForm3 = props.datosForm3;
  }

  convertToPDF = () => {
    const element = document.getElementById("pdfContent");
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}_${
      currentDate.getMonth() + 1
    }_${currentDate.getFullYear()}`;
    const nameApp = "5apps";
    const viaje = this.datosForm3.Viaje;

    const fileName = `${nameApp}_${viaje}_${formattedDate}.pdf`;
    // console.log(this.datosForm3);
    const opt = {
      margin: 10,
      filename: fileName,
      image: { type: "png", quality: 10, scale: 15 },
      image: { type: "jpeg", quality: 15, scale: 15 },
      html2canvas: { scale: 7 },
      jsPDF: { format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  render() {
    // Obtener la fecha actual
    const currentDate = new Date();
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
        <div id="pdfContent">
          <div className="content">
            <div className="container_content">
              <section className="banner__logos">
                <img src="./src/img/rpt_pdf/logo_mint.png" alt="f" />
                <img
                  src="./src/img/rpt_pdf/logo_iso.png"
                  alt="f"
                  className="logo_iso"
                />
                <hr className="hr_logos" />
                {this.datosForm3.Nit_Emp == "860015624-1         " && (
                  <img src="./src/img/rpt_pdf/logo_ber.jpeg" />
                )}
                {this.datosForm3.Nit_Emp == "900622702-6         " && (
                  <img src="./src/img/rpt_pdf/logo-tourline.png" />
                )}
                {this.datosForm3.Nit_Emp == "800204916-1         " && (
                  <img
                    src="./src/img/rpt_pdf/logo_cit.png"
                    alt="Firma Gerente"
                  />
                )}
                <img src="./src/img/rpt_pdf/logo_st.png" alt="f" />
                {/* <div className="logo_mint"></div>
              <div className="logo_iso"></div>
              <hr className="hr_logos" />
              <div className="logo_ber"></div>
              <div className="logo_st"></div> */}
              </section>
              <section className="title_doc">
                <p className="title_con">
                  FORMATO ÚNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PÚBLICO DE
                  <br />
                  TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL
                </p>
                <p className="num_viaje">
                  N° <b>{this.datosForm3.Consecutivo_FUEC}</b>{" "}
                  <span className="fecha">{formattedDate}</span>
                </p>
              </section>
              <section className="container_cont">
                <div className="cont_a">
                  <div className="items">
                    <div className="item_name bold">RAZON SOCIAL</div>
                    <div className="item_desc">
                      {this.datosForm3.Empresa_Registrado}
                    </div>
                  </div>
                  <div className="items">
                    <div className="item_name bold">CONTRATO N°</div>
                    <div className="item_desc">{tercerNumero}</div>
                  </div>
                  <nav className="items">
                    <div className="item_name bold">CONTRATANTE</div>
                    <div className="item_desc">
                      {this.datosForm3.Nombre_Cliente}
                    </div>
                  </nav>
                  <nav className="items">
                    <div className="item_name bold">OBJETO CONTRATO</div>
                    <div className="item_desc">
                      {this.datosForm3.Objeto_Contrato}
                    </div>
                  </nav>
                </div>
                <div className="cont_b">
                  <nav className="items">
                    <div className="item_nit bold">NIT</div>
                    <div className="item_desc">{this.datosForm3.Nit_Emp}</div>
                  </nav>
                  <nav className="items">
                    <div className="item_nit bold">NIT</div>
                    <div className="item_desc">
                      {this.datosForm3.NIT_Cliente}
                    </div>
                  </nav>
                </div>
              </section>
              <section className="containers">
                <div className="item_name center bold">RECORRIDO</div>
                <nav className="items">
                  <div className="item_name item_3rem bold">ORIGEN</div>
                  <div className="item_desc">{this.datosForm3.Origen}</div>
                </nav>
                <nav className="items">
                  <div className="item_name item_3rem bold">DESTINO</div>
                  <div className="item_desc">{this.datosForm3.Destino}</div>
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
                  <div className="item_name item_full bold">FECHA INICIAL</div>
                  <div className="item_name item_full">{diaP}</div>
                  <div className="item_name item_full">{mesP}</div>
                  <div className="item_name item_full">{anioP}</div>
                </nav>
                <nav className="items">
                  <div className="item_name item_full bold">
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
                  <div className="item_name item_full no_line bold">PLACA</div>
                  <div className="item_name item_full no_line bold">MODELO</div>
                  <div className="item_name item_full no_line bold">MARCA</div>
                  <div className="item_name item_full no_line bold">CLASE</div>
                </nav>
                <nav className="items items_center line_rpt">
                  <div className="item_name item_full no_line">
                    {this.datosForm3.Placa}
                  </div>
                  <div className="item_name item_full no_line">
                    {this.datosForm3.Modelo}
                  </div>
                  <div className="item_name item_full no_line">
                    {this.datosForm3.Descripcion_Marca}
                  </div>
                  <div className="item_name item_full no_line">
                    {this.datosForm3.Descripcion_Clase}
                  </div>
                </nav>
                <nav className="items items_center no_line">
                  <div className="item_name item_full">
                    <div>
                      <strong>NUMERO INTERNO:</strong>{" "}
                      <span>{this.datosForm3.Bus}</span>
                    </div>
                  </div>
                  <div className="item_name item_full">
                    <div>
                      <strong>NUMERO TARJETA OPERACION:</strong>{" "}
                      <span>{this.datosForm3.Num_Tarjeta_Operacion}</span>
                    </div>
                  </div>
                </nav>

                <nav className="items items_center no_line">
                  <div className="item_name item_full item_table item_55"></div>
                  <div className="item_name item_full item_table text_6 item_table bold">
                    NOMBRES Y APELLIDOS
                  </div>
                  <div className="item_name item_full item_table bold">
                    NUMERO DE CEDULA
                  </div>
                  <div className="item_name item_full item_table bold text_6">
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
                  <div className="item_name item_full item_table text_4 height_100 ">
                    {this.datosForm3.Apellido_Conductor1}{" "}
                    {this.datosForm3.Nombre_Conductor1}
                  </div>
                  <div className="item_name item_full item_table height_100 ">
                    {this.datosForm3.Cedula_Conductor1}
                  </div>
                  <div className="item_name item_full item_table height_100 ">
                    {this.datosForm3.Pase1_Conductor1}
                  </div>
                  <div className="item_name item_full item_table text_6 height_100 ">
                    {this.datosForm3.fechavencimiento1_Conductor1}
                  </div>
                </nav>
                <nav className="items items_center no_line height_2rem">
                  <div className="item_name item_full item_table height_100 text_6 item_55 bold">
                    DATOS DEL CONDUCTOR
                  </div>
                  <div className="item_name item_full item_table height_100 text_4 ">
                    {this.datosForm3.Nombre_Conductor2}{" "}
                    {this.datosForm3.Apellido_Conductor2}
                  </div>
                  <div className="item_name item_full item_table height_100 ">
                    {this.datosForm3.Cedula_Conductor2}
                  </div>
                  <div className="item_name item_full item_table height_100 ">
                    {this.datosForm3.Pase1_Conductor2}
                  </div>
                  <div className="item_name item_full item_table text_6 height_100 ">
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
                  <div className="item_name item_full item_table bold">
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
                  <div className="item_name item_full item_table text_4 height_100 item_55 bold">
                    RESPONSABLE DEL CONTRATANTE
                  </div>
                  <div className="item_name item_full item_table text_4 height_100 ">
                    {this.datosForm3.Rep_Nombres}{" "}
                    {this.datosForm3.Rep_Apellidos}
                  </div>
                  <div className="item_name item_full item_table height_100 ">
                    {this.datosForm3.Rep_cedula}
                  </div>
                  <div className="item_name item_full item_table text_6 height_100 ">
                    {this.datosForm3.Telefono_Cliente}
                  </div>
                  <div className="item_name item_full item_table text_6 height_100 ">
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
                  El contratante y Berlinastur S.A., declaran que cuentan con la
                  autorización del responsable designado por parte del
                  contratante y del conductor(es), respectivamente, así como las
                  personas de las cuales en el futuro suministren información
                  personal, para transmitir su información a la otra parte para
                  efectos de gestionar y adelantar todas las actividades
                  concernientes a la prestación del servicio de transporte
                  terrestre contratado, el pago correspondiente y establecer un
                  canal de comunicación permanente durante la ejecución de este
                  contrato. Las partes tratarán información bajo los
                  lineamientos previstos en la Ley 1581 de 2012, el Decreto 1377
                  de 2013 y su política de información personal. La Política de
                  Tratamiento de Datos Personales puede ser consultada en
                  www.berlinasdelfonce.com y su canal de atención es
                  proteccióndedatos@berlinasdelfonce.com.
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
                      {this.datosForm3.Nit_Emp == "860015624-1         " && (
                        <>
                          <img src="./src/img/rpt_pdf/FIRMA_PJC.png" />
                          <hr className="hr_hor" />
                          Pedro José Cobos
                        </>
                      )}
                      {this.datosForm3.Nit_Emp == "900622702-6         " && (
                        <>
                          <div>
                            <img src="./src/img/rpt_pdf/FIRMA_PJC.png" />
                            <img src="./src/img/rpt_pdf/logo-tourline.png" />
                          </div>
                          <hr className="hr_hor" />
                          Pedro José Cobos
                        </>
                      )}
                      {this.datosForm3.Nit_Emp == "800204916-1         " && (
                        <>
                          <img src="./src/img/rpt_pdf/FIRMA_PJC.png" />
                          <hr className="hr_hor" />
                          Pedro José Cobos
                        </>
                      )}
                      <br />
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

        {/* Botón para iniciar la conversión y descarga del pdf */}
        <button onClick={this.convertToPDF} className="submit-button botton_gp">
          Descargar PDF
        </button>
      </div>
    );
  }
}

export default HTMLtoPDF;
