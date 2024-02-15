import React from "react";

const SelectEmpresa = ({ empresa, onChange, allowedCodes }) => {
  const empresas = [
    { codigo: 277, nombre: "BERLINAS DEL FONCE S.A." },
    { codigo: 278, nombre: "BERLITUR S.A.S." },
    { codigo: 300, nombre: "COMPAÑIA LIBERTADOR S.A." },
    { codigo: 310, nombre: "CARTAGENA INTERNATIONAL TRAVELS S.A.S. 'CIT'" },
    { codigo: 320, nombre: "TOURLINE EXPRESS S.A.S." },
    { codigo: 2771, nombre: "TRANSCARGA BERLINAS S.A." },
    { codigo: 9001, nombre: "SERVICIO ESPECIAL" },
  ];

  const filteredEmpresas = empresas.filter((empresa) =>
    allowedCodes.includes(empresa.codigo)
  );

  return (
    <div className="input-container agg_colaborador">
      <select className="opciones" value={empresa} onChange={onChange}>
        <option value="" disabled>
          Seleccionar
        </option>
        {filteredEmpresas.map((empresa) => (
          <option key={empresa.codigo} value={empresa.codigo}>
            {empresa.nombre}
          </option>
        ))}
      </select>
      <label className="input-label-options label">Empresa</label>
    </div>
  );
};

export default SelectEmpresa;
