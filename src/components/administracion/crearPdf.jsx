import React from 'react';
import html2pdf from 'html2pdf.js';
import './crearPdf.css';

class HTMLtoPDF extends React.Component {
  convertToPDF = () => {
    const element = document.getElementById('pdfContent'); // ID del elemento que contiene tu HTML

    html2pdf()
      .from(element)
      .save();
  };

  render() {
    return (
      <div>
        {/* Aquí colocas el HTML que deseas convertir */}
        <div id="pdfContent">
            <div className="content">
                <section className="banner__logos">
                    <div className="logo_mint"></div>
                    <div className="logo_iso"></div>
                    <hr className="hr_logos"/>
                    <div className="logo_ber"></div>
                    <div className="logo_st"></div>
                </section>
                <section className="title_doc">
                    <p className="title_con">FORMATO ÚNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PÚBLICO DE<br/>
                        TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL</p>
                    <p className="num_viaje">N° 324234234-2023-3101-3096 <span className="fecha">05/12/2023</span></p>
                </section>
                <section className="container_cont">
                    <div className="cont_a">
                        <div className="items">
                            <div className="item_name">Razon social</div>
                            <div className="item_desc">TRANSPORTES Y TURISMO BERLINAS DEL FONCE S.A.</div>
                        </div>
                        <div className="items">
                            <div className="item_name">Contrato N°</div>
                            <div className="item_desc">3101</div>
                        </div>
                        <nav className="items">
                            <div className="item_name">Contratante</div>
                            <div className="item_desc">AGENCIA DE VIAJES OPERADORA BERLINASTUR S.A.</div>
                        </nav>
                        <nav className="items">
                            <div className="item_name">Objeto contrato</div>
                            <div className="item_desc">TRANSPORTE DE PARTICULARES (GRUPO - PERSONA NATURAL)</div>
                        </nav>
                    </div>
                    <div className="cont_b">
                        <nav className="items">
                            <div className="item_nit">Nit</div>
                            <div className="item_desc">860015624-1</div>
                        </nav>
                        <nav className="items">
                            <div className="item_nit">Nit</div>
                            <div className="item_desc">860015624-1</div>
                        </nav>
                    </div>

                </section>
                <section className="containers">
                    <div className="item_name center">RECORRIDO</div>
                    <nav className="items">
                        <div className="item_name item_3rem">ORIGEN</div>
                        <div className="item_desc">BARRANQUILLA Y SU AREA METROPOLITANA</div>
                    </nav>
                    <nav className="items">
                        <div className="item_name item_3rem">DESTINO</div>
                        <div className="item_desc">SANTA MARTA-RODADERO-ZIRUMA-CENTRO-MAMATOCO, TRONCAL DEL CARIBE</div>
                    </nav>
                    <div className="item_name item_100">CONVENIO DE COLABORACION:</div>
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
                    <div className="item_name center">CARACTERISTICAS DEL VEHICULO</div>
                    <nav className="items items_center line_rpt">
                        <div className="item_full no_line">PLACA</div>
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
                            <div>NUMERO INTERNO: <span>933</span></div>
                        </div>
                        <div className="item_name item_full">
                            <div>NUMERO TARJETA OPERACION: <span>333033</span></div>
                        </div>
                    </nav>

                    <nav className="items items_center no_line">
                        <div className="item_name item_full item_table item_55"></div>
                        <div className="item_name item_full item_table text_5 item_table">NOMBRES Y APELLIDOS</div>
                        <div className="item_name item_full item_table">NUMERO DE CEDULA</div>
                        <div className="item_name item_full item_table text_5">LICENCIA DE CONDUCCION</div>
                        <div className="item_name item_full item_table text_6">VIGENCIA</div>
                    </nav>
                    <nav className="items items_center no_line height_2rem">
                        <div className="item_name item_full item_table text_5 height_100 item_55">DATOS DEL CONDUCTOR</div>
                        <div className="item_name item_full item_table text_4 height_100 lineh_2rem">HECTOR DARIO GUERRA JIMENEZ
                        </div>
                        <div className="item_name item_full item_table height_100 lineh_2rem">88288351</div>
                        <div className="item_name item_full item_table height_100 lineh_2rem">88288351</div>
                        <div className="item_name item_full item_table text_6 height_100 lineh_2rem">Jul 11 2025 12:00AM</div>
                    </nav>
                    <nav className="items items_center no_line height_2rem">
                        <div className="item_name item_full item_table height_100 text_5 item_55">DATOS DEL CONDUCTOR</div>
                        <div className="item_name item_full item_table height_100 text_4 lineh_2rem">HECTOR DARIO GUERRA JIMENEZ
                        </div>
                        <div className="item_name item_full item_table height_100 lineh_2rem">88288351</div>
                        <div className="item_name item_full item_table height_100 lineh_2rem">88288351</div>
                        <div className="item_name item_full item_table text_6 height_100 lineh_2rem">Jul 11 2025 12:00AM</div>
                    </nav>
                    <nav className="items items_center no_line">
                        <div className="item_name item_full item_table item_55"></div>
                        <div className="item_name item_full item_table text_5 item_table">NOMBRES Y APELLIDOS</div>
                        <div className="item_name item_full item_table">NUMERO DE CEDULA</div>
                        <div className="item_name item_full item_table">TELEFONO</div>
                        <div className="item_name item_full item_table text_6">DIRECCION</div>
                    </nav>
                    <nav className="items items_center no_line height_2rem">
                        <div className="item_name item_full item_table text_4 height_100 item_55">RESPONSABLE DEL CONTRATANTE</div>
                        <div className="item_name item_full item_table text_4 height_100 lineh_2rem">HECTOR DARIO GUERRA JIMENEZ
                        </div>
                        <div className="item_name item_full item_table height_100 lineh_2rem">72194995</div>
                        <div className="item_name item_full item_table text_6 height_100 lineh_2rem">317 638 2363</div>
                        <div className="item_name item_full item_table text_6 height_100 lineh_2rem">Calle 93 No. 46-136</div>
                    </nav>
                </section>
                <section className="container_text">
                    <p className="terms"><strong>Protocolo de Alistamiento Preventivo realizado según resolución 315 del Ministerio
                            de Transporte
                            (06 de
                            febrero de 2013).</strong><br/>
                        El contratante y Berlinastur S.A., declaran que cuentan con la autorización del responsable designado
                        por parte del contratante y del conductor(es),
                        respectivamente, así como las personas de las cuales en el futuro suministren información personal, para
                        transmitir su información a la otra parte para
                        efectos de gestionar y adelantar todas las actividades concernientes a la prestación del servicio de
                        transporte terrestre contratado, el pago
                        correspondiente y establecer un canal de comunicación permanente durante la ejecución de este contrato.
                        Las partes tratarán información bajo los
                        lineamientos previstos en la Ley 1581 de 2012, el Decreto 1377 de 2013 y su política de información
                        personal. La Política de Tratamiento de Datos
                        Personales puede ser consultada en www.berlinasdelfonce.com y su canal de atención es
                        proteccióndedatos@berlinasdelfonce.com.</p>
                </section>
                <section className="containers">
                    <nav className="items items_center no_line height_5rem">
                        <div className="item_name item_full item_table height_5rem">
                            <p className="title_con"><strong>Carrera 68D #15-15 Tel.: 7435050</strong>
                                informacion@berlinasdelfonce.com<br/>
                                <strong>Bogotá D.C.</strong>
                            </p>
                        </div>
                        <div className="item_name item_full item_table height_5rem">
                            <div className="title_con">
                                <div className="img_firmapj"></div>
                                Pedro José Cobos<br/>
                                <hr/>
                                <strong>FIRMA GERENTE</strong>
                            </div>
                        </div>
                    </nav>
                </section>
            </div>
        </div>

        {/* Botón para iniciar la conversión */}
        <button onClick={this.convertToPDF}>Descargar PDF</button>
      </div>
    );
  }
}

export default HTMLtoPDF;
