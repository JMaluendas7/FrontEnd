const InputBus = ({ bus, setbus }) => {
  return (
    <div className="input-container">
      <input
        className="input-field icon_input_bus"
        placeholder=""
        type="text"
        value={bus}
        onChange={(e) => setbus(e.target.value)}
      />
      <label className="input-label">N° de Bus</label>
    </div>
  );
};

export default InputBus;
