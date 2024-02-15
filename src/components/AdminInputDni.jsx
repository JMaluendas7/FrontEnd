const InputDni = ({ dni, onChange, label = "Numero De Documento" }) => {
  return (
    <div className="input-container">
      <input
        className="input-field-large icon_input_dni"
        placeholder=""
        type="number"
        value={dni}
        onChange={onChange}
      />
      <label className="input-label">{label}</label>
    </div>
  );
};

export default InputDni;
