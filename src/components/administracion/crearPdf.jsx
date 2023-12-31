import React from "react";
import html2pdf from "html2pdf.js";
import "./crearPdf.css";

class HTMLtoPDF extends React.Component {
  convertToPDF = () => {
    const element = document.getElementById("pdfContent");

    const opt = {
      margin: 10,
      filename: "documento.pdf",
      //   image: { type: "png", quality: 10 }, // Cambio a formato PNG y aumento de calidad
      image: { type: "jpeg", quality: 10 }, // Ajusta la calidad de las imágenes
      html2canvas: { scale: 15 }, // Escala de renderizado de HTML a imagen (mejora calidad)
      jsPDF: { format: "letter", orientation: "portrait" }, // Formato carta y orientación vertical
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

    return (
      <div>
        <div id="pdfContent">
          <div className="content">
            <section className="banner__logos">
              <img src="./src/img/rpt_pdf/logo_mint.png" alt="f" />
              <img
                src="./src/img/rpt_pdf/logo_iso.png"
                alt="f"
                className="logo_iso"
              />
              <hr className="hr_logos" />
              <img src="./src/img/rpt_pdf/logo_ber.jpeg" alt="f" />
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
                N° 324234234-2023-3101-3096{" "}
                <span className="fecha">{formattedDate}</span>
              </p>
            </section>
            <section className="container_cont">
              <div className="cont_a">
                <div className="items">
                  <div className="item_name">RAZON SOCIAL</div>
                  <div className="item_desc">
                    TRANSPORTES Y TURISMO BERLINAS DEL FONCE S.A.
                  </div>
                </div>
                <div className="items">
                  <div className="item_name">CONTRATO N°</div>
                  <div className="item_desc">3101</div>
                </div>
                <nav className="items">
                  <div className="item_name">CONTRATANTE</div>
                  <div className="item_desc">
                    AGENCIA DE VIAJES OPERADORA BERLINASTUR S.A.
                  </div>
                </nav>
                <nav className="items">
                  <div className="item_name">OBJETO CONTRATO</div>
                  <div className="item_desc">
                    TRANSPORTE DE PARTICULARES (GRUPO - PERSONA NATURAL)
                  </div>
                </nav>
              </div>
              <div className="cont_b">
                <nav className="items">
                  <div className="item_nit">NIT</div>
                  <div className="item_desc">860015624-1</div>
                </nav>
                <nav className="items">
                  <div className="item_nit">NIT</div>
                  <div className="item_desc">860015624-1</div>
                </nav>
              </div>
            </section>
            <section className="containers">
              <div className="item_name center">RECORRIDO</div>
              <nav className="items">
                <div className="item_name item_3rem">ORIGEN</div>
                <div className="item_desc">
                  BARRANQUILLA Y SU AREA METROPOLITANA
                </div>
              </nav>
              <nav className="items">
                <div className="item_name item_3rem">DESTINO</div>
                <div className="item_desc">
                  SANTA MARTA-RODADERO-ZIRUMA-CENTRO-MAMATOCO, TRONCAL DEL
                  CARIBE
                </div>
              </nav>
              <div className="item_name item_name2 item_100">
                CONVENIO DE COLABORACION:
              </div>
            </section>
            <section className="containers">
              <div className="item_name center">VIGENCIA DEL CONTRATO</div>
              <nav className="items">
                <div className="item_name item_full">FECHA INICIAL</div>
                <div className="item_name item_full">05</div>
                <div className="item_name item_full">12</div>
                <div className="item_name item_full">2023</div>
              </nav>
              <nav className="items">
                <div className="item_name item_full">FECHA DE VENCIMIENTO</div>
                <div className="item_name item_full">06</div>
                <div className="item_name item_full">12</div>
                <div className="item_name item_full">2023</div>
              </nav>
            </section>
            <section className="containers">
              <div className="item_name center">
                CARACTERISTICAS DEL VEHICULO
              </div>
              <nav className="items items_center line_rpt">
                <div className="item_name item_full no_line">PLACA</div>
                <div className="item_name item_full no_line">MODELO</div>
                <div className="item_name item_full no_line">MARCA</div>
                <div className="item_name item_full no_line">CLASE</div>
              </nav>
              <nav className="items items_center line_rpt">
                <div className="item_name item_full no_line">WFQ435</div>
                <div className="item_name item_full no_line">2016</div>
                <div className="item_name item_full no_line">MERCEDES BENZ</div>
                <div className="item_name item_full no_line">MICROBUS</div>
              </nav>
              <nav className="items items_center no_line">
                <div className="item_name item_full">
                  <div>
                    NUMERO INTERNO: <span>933</span>
                  </div>
                </div>
                <div className="item_name item_full">
                  <div>
                    NUMERO TARJETA OPERACION: <span>333033</span>
                  </div>
                </div>
              </nav>

              <nav className="items items_center no_line">
                <div className="item_name item_full item_table item_55"></div>
                <div className="item_name item_full item_table text_6 item_table">
                  NOMBRES Y APELLIDOS
                </div>
                <div className="item_name item_full item_table">
                  NUMERO DE CEDULA
                </div>
                <div className="item_name item_full item_table text_6">
                  LICENCIA DE CONDUCCION
                </div>
                <div className="item_name item_full item_table text_6">
                  VIGENCIA
                </div>
              </nav>
              <nav className="items items_center no_line height_2rem">
                <div className="item_name item_full item_table text_6 height_100 item_55">
                  DATOS DEL CONDUCTOR
                </div>
                <div className="item_name item_full item_table text_4 height_100 ">
                  HECTOR DARIO GUERRA JIMENEZ
                </div>
                <div className="item_name item_full item_table height_100 ">
                  88288351
                </div>
                <div className="item_name item_full item_table height_100 ">
                  88288351
                </div>
                <div className="item_name item_full item_table text_6 height_100 ">
                  Jul 11 2025 12:00AM
                </div>
              </nav>
              <nav className="items items_center no_line height_2rem">
                <div className="item_name item_full item_table height_100 text_6 item_55">
                  DATOS DEL CONDUCTOR
                </div>
                <div className="item_name item_full item_table height_100 text_4 ">
                  HECTOR DARIO GUERRA JIMENEZ
                </div>
                <div className="item_name item_full item_table height_100 ">
                  88288351
                </div>
                <div className="item_name item_full item_table height_100 ">
                  88288351
                </div>
                <div className="item_name item_full item_table text_6 height_100 ">
                  Jul 11 2025 12:00AM
                </div>
              </nav>
            </section>
            <section className="containers martop_02">
              <nav className="items items_center no_line">
                <div className="item_name item_full item_table item_55"></div>
                <div className="item_name item_full item_table text_6 item_table">
                  NOMBRES Y APELLIDOS
                </div>
                <div className="item_name item_full item_table">
                  NUMERO DE CEDULA
                </div>
                <div className="item_name item_full item_table">TELEFONO</div>
                <div className="item_name item_full item_table text_6">
                  DIRECCION
                </div>
              </nav>
              <nav className="items items_center no_line height_2rem">
                <div className="item_name item_full item_table text_4 height_100 item_55">
                  RESPONSABLE DEL CONTRATANTE
                </div>
                <div className="item_name item_full item_table text_4 height_100 ">
                  HECTOR DARIO GUERRA JIMENEZ
                </div>
                <div className="item_name item_full item_table height_100 ">
                  72194995
                </div>
                <div className="item_name item_full item_table text_6 height_100 ">
                  317 638 2363
                </div>
                <div className="item_name item_full item_table text_6 height_100 ">
                  Calle 93 No. 46-136
                </div>
              </nav>
            </section>
            <section className="container_text">
              <p className="terms">
                <strong>
                  Protocolo de Alistamiento Preventivo realizado según
                  resolución 315 del Ministerio de Transporte (06 de febrero de
                  2013).
                </strong>
                <br />
                El contratante y Berlinastur S.A., declaran que cuentan con la
                autorización del responsable designado por parte del contratante
                y del conductor(es), respectivamente, así como las personas de
                las cuales en el futuro suministren información personal, para
                transmitir su información a la otra parte para efectos de
                gestionar y adelantar todas las actividades concernientes a la
                prestación del servicio de transporte terrestre contratado, el
                pago correspondiente y establecer un canal de comunicación
                permanente durante la ejecución de este contrato. Las partes
                tratarán información bajo los lineamientos previstos en la Ley
                1581 de 2012, el Decreto 1377 de 2013 y su política de
                información personal. La Política de Tratamiento de Datos
                Personales puede ser consultada en www.berlinasdelfonce.com y su
                canal de atención es proteccióndedatos@berlinasdelfonce.com.
              </p>
            </section>
            <section className="containers">
              <nav className="items items_center no_line height_5rem">
                <div className="item_name item_full item_table height_5rem">
                  <p className="title_con">
                    <strong>Carrera 68D #15-15 Tel.: 7435050</strong>
                    informacion@berlinasdelfonce.com
                    <br />
                    <strong>Bogotá D.C.</strong>
                  </p>
                </div>
                <div className="item_name item_full item_table height_5rem">
                  <div className="title_con">
                    <img src="./src/img/rpt_pdf/FIRMA WS.png"></img>
                    <hr className="hr_hor" />
                    Pedro José Cobos
                    <br />
                    <strong>FIRMA GERENTE</strong>
                  </div>
                </div>
              </nav>
            </section>
            <footer className="footer">
              <h3>
                Pag 1/1 F-07-009 / Version 6 / 27-01-20F-07-009 / Version 6 /
                27-01-2
              </h3>
              <h3>N° viaje: 622050</h3>
            </footer>
          </div>
        </div>

        {/* Botón para iniciar la conversión */}
        <button onClick={this.convertToPDF} className="botton_gp">
          Descargar PDF
        </button>
      </div>
    );
  }
}

export default HTMLtoPDF;
