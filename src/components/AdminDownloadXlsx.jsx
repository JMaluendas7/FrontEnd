const descargarArchivo = ({ fileName, blob }) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const formattedFileName = `5Apps_${fileName}_${timestamp}.xlsx`;
  const url = URL.createObjectURL(new Blob([blob]));
  //   console.log(fileName);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", formattedFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default descargarArchivo;
