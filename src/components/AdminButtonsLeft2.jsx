const ContainerButtonsLeft2 = ({
  isLoading,
  showTable,
  generarExcel,
  showPdf,
  DownloadPDF,
  PrintPDF,
}) => {
  return (
    <div className="buttons_left">
      {isLoading && <div className="loader"></div>}
      {showTable && (
        <div className="container__buttons_left" onClick={generarExcel}>
          <div className="descargar-xlsx">
            <div className="buttons_left-label">Exportar a XLSX</div>
          </div>
        </div>
      )}
      {showPdf && (
        <>
          <div className="container__buttons_left" onClick={DownloadPDF}>
            <div className="descargar-pdf">
              <div className="buttons_left-label">Descargar PDF</div>
            </div>
          </div>
          <div className="container__buttons_left" onClick={PrintPDF}>
            <div className="imprimir">
              <div className="buttons_left-label">Imprimir PDF</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContainerButtonsLeft2;
