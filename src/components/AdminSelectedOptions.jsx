import React from "react";

const SelectOptions = ({
  value,
  onChange,
  options,
  label = "Tipo Informe",
}) => {
  return (
    <div className="input-container agg_colaborador">
      <select className="opciones" value={value} onChange={onChange}>
        <option value={value ? -1 : ""} disabled>
          Seleccionar
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label className="input-label-options label">{label}</label>
    </div>
  );
};

export default SelectOptions;
